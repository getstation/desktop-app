import { search } from '@getstation/sdk';
import { chain as flatMap, propOr } from 'ramda';
import { SearchSection } from '../sdk/search/types';

import { SearchResultSerialized, SearchSectionSerialized } from './duck';

export const EMPTY_SECTION = 'bang/EMPTY_SECTION';
export const sectionsAlwaysExpanded = [EMPTY_SECTION, 'Top Hits'];

export const getSectionResults: (_: SearchSectionSerialized) => SearchResultSerialized[] = propOr([], 'results');
export const flattenResults: (_: SearchSectionSerialized[]) => SearchResultSerialized[] = flatMap(getSectionResults);

export type SectionKinds = 'top-hits' | 'apps' | 'app-specific';

export namespace SectionKinds {
  export function getCategory(kind: SectionKinds): string {
    if (kind === 'apps') return 'Apps';
    if (kind === 'top-hits') return 'Top Hits';
    return '';
  }

  export function getSectionKinds(section: string): SectionKinds {
    if (section === getCategory('apps')) return 'apps';
    if (section === getCategory('top-hits')) return 'top-hits';
    return 'app-specific';
  }
}

export type Callback = () => void;
export type CallbacksStore = Map<string, Callback>;

export const getSelectionCallback = (callbacksStore: CallbacksStore, id: string): Callback => callbacksStore.get(id)!;

export function serializeResults(
  sections: SearchSection[], callbacksStore: Map<string, Callback> | undefined = undefined): SearchSectionSerialized[] {
  const insertedCallbacks: string[] = [];
  const sectionsSerialized: SearchSectionSerialized[] = sections.map((section: SearchSection) => {
    let sectionSerializedResults: SearchResultSerialized[] = [];
    const sectionKind: SectionKinds = SectionKinds.getSectionKinds(section.sectionName);
    if (section.results) {
      sectionSerializedResults = section.results.map((r: search.SearchResultItem) => {
        if (callbacksStore && typeof r.onSelect === 'function') {
          callbacksStore.set(r.resourceId, r.onSelect);
          insertedCallbacks.push(r.resourceId);
        }
        return {
          ...r,
          onSelect: Boolean(r.onSelect),
          sectionKind,
        } as SearchResultSerialized;
      });
    }
    return {
      ...section,
      sectionKind,
      results: sectionSerializedResults,
    };
  });

  if (callbacksStore) {
    callbacksStore.forEach((_: Function, key: string, map: Map<string, Function>) => {
      if (insertedCallbacks.includes(key)) return;

      map.delete(key);
    });
  }

  return sectionsSerialized;
}
