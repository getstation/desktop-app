import { SDK, search } from '@getstation/sdk';
import deepExtend = require('deep-extend');
import { compose, prop, reject } from 'ramda';
import { contained } from 'ramda-adjunct';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { idExtractor } from './activity';
import { getResource } from './gateway/api';
import { isLogged } from './gateway/cookies';
import { stripUuid } from './gateway/helpers';
import {
  fetchSearchCollections,
  fetchSearchPages,
  fetchUserContent,
} from './gateway/methods';
import {
  genericParser,
  userContentToWorkspaces,
} from './gateway/transformer';
import {
  asSearchItem,
  getLabel,
} from './helpers';

type CancelQuery = () => void;

class Search {
  public static instance;

  private static readonly errors: Subject<Error> = new Subject();

  private searchQuerySubscription: Subscription | null = null;
  private readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  static async activate(sdk: SDK): Promise<Observable<Error>> {
    if (!this.instance) {
      this.instance = new this(sdk);
      await this.instance.process();
    }
    return this.errors.asObservable();
  }

  static deactivate() {
    if (this.instance) {
      this.instance.stopSubscriptions();
      this.instance = null;
    }
  }

  public stopSubscriptions() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }

  public async process() {
    let cancelRunningQueries: CancelQuery[] = [];

    this.stopSubscriptions();
    this.searchQuerySubscription = this.sdk.search.query
      .pipe(
        tap((query) => {
          // each time user type something, we cancel running queries.
          cancelRunningQueries.forEach(cancel => cancel());
          cancelRunningQueries = [];
          if (query.value) {
            this.sdk.search.results.next({ loading: 'notion' });
          } else {
            this.sdk.search.results.next({ results: [] });
          }
        }),
        filter(query => Boolean(query.value)), // ignore empty query
        distinctUntilChanged(),
        debounceTime(150)
      )
      .subscribe(
        async (query) => {
          if (!isLogged) return;

          let cancelled = false;
          cancelRunningQueries.push(() => { cancelled = true; });

          // Fetch results
          const results: search.SearchResultItem[] = [];

          const workspaces = await getResource({}, fetchUserContent, userContentToWorkspaces, this.sdk);

          if (cancelled) return;

          for (const workspace of workspaces) { // TODO: use Promise.all for each workspaces
            const [searchPages, searchCollections] = await Promise.all([
              await getResource(
                {
                  query: query.value, spaceId: workspace.id, limit: 30,
                },
                fetchSearchPages, genericParser, this.sdk),
              await getResource(
                {
                  query: query.value, spaceId: workspace.id, limit: 30,
                },
                fetchSearchCollections, genericParser, this.sdk),
            ]);

            if (cancelled) return;

            results.push(
              ...this.getResults(
                workspace.name,
                workspace.domain,
                {
                  results: [...new Set([...searchPages.results, ...searchCollections.results])],
                  recordMap: deepExtend(searchPages.recordMap, searchCollections.recordMap),
                }
              )
            );
          }

          const tabsAsResourceIds = this.sdk.tabs.getTabs()
            .map(tab => idExtractor(tab.url) || '')
            .filter(x => Boolean(x));

          const isTabHasResourceId = compose(contained(tabsAsResourceIds), prop('resourceId'));
          const rejectResultIfAvailableAsTab = reject<search.SearchResultItem>(isTabHasResourceId);

          this.sdk.search.results.next({
            results: rejectResultIfAvailableAsTab(results),
          });
        },
        e => Search.errors.next(e)
      );
  }

  private getResults(workspaceName: string, domain: string, results: any): search.SearchResultItem[] {
    return results
      .results
      .map((r: any) => {
        const pageBlock = results.recordMap.block && results.recordMap.block[r];
        const pageCollection = (
          (results.recordMap.collection &&
            results.recordMap.block[r] &&
            results.recordMap.block[r].value.type === 'collection_view_page' &&
            results.recordMap.collection[results.recordMap.block[r].value.collection_id])
          ||
          (results.recordMap.collection && results.recordMap.collection[r]));

        if (pageBlock && pageBlock.value.type === 'page') {
          const id = stripUuid(pageBlock.value.id);
          return asSearchItem(workspaceName, domain, id, getLabel(pageBlock.value)!, this.sdk);
        }

        if (pageCollection) {
          const id = stripUuid(pageCollection.value.parent_id);
          // we don't want handle collection_page_properties
          if (!Boolean(pageCollection.value) || !Boolean(pageCollection.value.name)) return undefined;
          return asSearchItem(workspaceName, domain, id, getLabel(pageCollection.value)!, this.sdk);
        }

        return undefined;
      })
      .filter(r => Boolean(r));
  }
}

export default Search;
