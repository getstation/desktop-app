import {
  assoc,
  both,
  compose,
  defaultTo,
  filter,
  ifElse,
  lensProp,
  map,
  over,
  pipe,
  prop,
  propEq,
  propOr,
  reject,
  sort,
  take,
  uniqBy,
} from 'ramda';

import { isEmptyArray } from 'ramda-adjunct';
import { Comparator, constantComparator, Filter, Predicate, Selector, Sorter, Transformer } from '../../utils/fp';
import { removeHashFromURL } from '../../tab-webcontents/api';
import { getSectionResults, SectionKinds } from '../api';
import { SearchPaneItemSelectedItem, SearchResultSerialized, SearchSectionSerialized } from '../duck';

export type ItemType = SearchPaneItemSelectedItem;
export type SearchItem = SearchResultSerialized;
export type Section = SearchSectionSerialized;
export type SectionsOrganizer = Transformer<Section[]>;

/* --- The filter part ------------------------------------------------------------------------- */
const isLoaded: Predicate<Section> = propEq('loading', false);
const hasNoResult: Predicate<Section> = compose(isEmptyArray, getSectionResults);

const filterSearchResults: SectionsOrganizer = reject(
  both(isLoaded, hasNoResult)
);
/* ---------------------------------------------------------------------------------------------- */

/* --- The ordering part ------------------------------------------------------------------------ */
const sectionIs = (kind: SectionKinds): Predicate<Section> => propEq('sectionKind', kind);

const getTopHits: Filter<Section> = filter(sectionIs('top-hits'));
const getApps: Filter<Section> = filter(sectionIs('apps'));
const getAppSpecific: Filter<Section> = filter(sectionIs('app-specific'));

const getType: Selector<SearchItem, ItemType> = propOr('integration-result', 'type');
const typeComparator: Comparator<ItemType> = constantComparator<ItemType>(['favorite', 'station-app', 'tab', 'integration-result']);

/**
 * Refactor idea: use a psi combinator
 * Please see https://github.com/char0n/ramda-adjunct/issues/634
 *
 * @type {Sorter<SearchItem>}
 */
const sortByType: Sorter<SearchItem> = sort((item1, item2) => {
  return typeComparator(getType(item1), getType(item2));
});

const orderSectionItemsByType: SectionsOrganizer = map(
  over(
    lensProp('results'),
    compose(sortByType, defaultTo([]))
  )
);

const orderSearchResults: SectionsOrganizer = (sections) => {
  const topHitsSections: Section[] = getTopHits(sections);
  const appsSections: Section[] = getApps(sections);
  const miscSections: Section[] = orderSectionItemsByType(getAppSpecific(sections));
  return [
    ...topHitsSections,
    ...appsSections,
    ...miscSections,
  ];
};
/* ---------------------------------------------------------------------------------------------- */

/* --- The deduplication part ------------------------------------------------------------------- */
const deduplicateSearchResultsBy = (getter: Selector<SearchItem, string>): Transformer<Section> =>
  over(lensProp('results'), pipe(
    defaultTo([]),
    uniqBy(getter)
  ));

const getUrlWithoutHash = compose(removeHashFromURL, propOr('', 'url'));

/**
 * If `item` has an `onSelect` callback, return resourceId, otherwise return stripped URL.
 * This is leveraged by `uniqBy` function to only apply unicity on `url` when there is no `onSelect`.
 */
const getUnicityGetter: (item: SearchItem) => string = ifElse(
  propEq('onSelect', true),
  prop('resourceId'),
  getUrlWithoutHash
);
/* ---------------------------------------------------------------------------------------------- */

/* --- The uniq ID part ------------------------------------------------------------------- */
const addUniqId = (sectionName: string) =>
  (result: SearchResultSerialized) =>
    assoc('uniqId', `${sectionName}-${result.resourceId}`, result);

const addUniqIdKeyToSearchResults: Transformer<Section> = section =>
  assoc('results', section.results!.map(addUniqId(section.sectionName)), section);
/* ---------------------------------------------------------------------------------------------- */

/* --- Limit the number of results for each section --------------------------------------------- */
const limitResults = (limit: number): Transformer<Section> =>
  over(lensProp('results'), take(limit));
/* ---------------------------------------------------------------------------------------------- */

export const organizeSearchResults: SectionsOrganizer = pipe(
  map(deduplicateSearchResultsBy(prop('resourceId'))), // 1st
  map(deduplicateSearchResultsBy(getUnicityGetter)), // 2nd
  filterSearchResults, // 3th
  map(limitResults(10)), // 4th
  map(addUniqIdKeyToSearchResults), // 5th
  orderSearchResults // 6th
);

export const organizeHistoryResults = pipe(
  map(deduplicateSearchResultsBy(prop('resourceId'))),
  map(deduplicateSearchResultsBy(getUnicityGetter)),
  map(limitResults(10)),
);
