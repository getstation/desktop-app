import { search } from '@getstation/sdk';
import * as Immutable from 'immutable';
import { combineLatest, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators'
import { AbstractProvider } from '../common';
import { SearchSection } from './types';

export function combineConsumersResultsWrappers(resultsWrappers: search.SearchResultWrapper[]): SearchSection[] {
  // A list of all results, whatever the consumer
  const allResults: search.SearchResultItem[] = resultsWrappers.reduce(
    (accumulator: search.SearchResultItem[], currentValue) => accumulator.concat(currentValue.results || []),
    []
  );
  // A Set of all categories that are in loading state
  const allLoadingCategories: Set<string> = resultsWrappers.reduce(
    (accumulator, currentValue) => currentValue.loading ? accumulator.add(currentValue.loading) : accumulator,
    new Set()
  );
  // Leverage groupBy method of Immutable
  const mapByCategories = Immutable.List(allResults).groupBy<string>(results => results!.category);

  return getSearchResults(allLoadingCategories, mapByCategories);
}

/**
 * With a Set of loading categories, and a Map of results grouped by categories,
 * merge the 2 into a Map of results and loading status grouped by categories.
 * Then transform this map to an array for serialization.
 * @param {Set<string>} loadingCategories
 * @param {Map<string, List<search.SearchResultItem>>} resultsGroupedByCat
 * @returns {SearchSection[]}
 */
function getSearchResults(loadingCategories: Set<string>,
                          resultsGroupedByCat: Immutable.Collection.Keyed<string, Immutable.Iterable<number, search.SearchResultItem>>)
  : SearchSection[] {
  const allCategories = resultsGroupedByCat.keySeq().toSet().union(Immutable.Set(loadingCategories));
  const sectionsMap: Map<string, SearchSection> = new Map();
  // @ts-ignore: incomplete Immutable declarations
  for (const category: string of allCategories) {
    sectionsMap.set(category, {
      sectionName: category,
      loading: loadingCategories.has(category),
      results: resultsGroupedByCat.get(category, Immutable.List()).toArray(),
    });
  }
  const sectionsArray: SearchSection[] = Array.from(sectionsMap.values());
  return sectionsArray.sort((a, b) => a.sectionName.localeCompare(b.sectionName));
}

export default class SearchProvider extends AbstractProvider<search.SearchConsumer> {

  public query: BehaviorSubject<search.SearchQuery>;
  public results: Subject<SearchSection[]>;
  protected resultsSubscription: Subscription;

  constructor() {
    super();
    this.query = new BehaviorSubject({ value: '' });
    this.results = new BehaviorSubject([]);
  }

  addConsumer(consumer: search.SearchConsumer) {
    super.pushConsumer(consumer);

    this.refreshResultsSubscription();
    const querySubscription = this.query.subscribe(consumer.query);

    super.subscribeConsumer(consumer, () => {
      querySubscription.unsubscribe();
      this.refreshResultsSubscription();
    });
  }

  protected refreshResultsSubscription() {
    if (this.resultsSubscription) this.resultsSubscription.unsubscribe();
    this.resultsSubscription = 
      // Keep only the last values of each of the consumers
      combineLatest(this._consumers.map(c => c.results))
        .pipe(
          debounceTime(50), // flickering results workaround
          map((resultsWrappers: search.SearchResultWrapper[]) =>
              combineConsumersResultsWrappers(resultsWrappers))
        )
        .subscribe(this.results);
  }
}
