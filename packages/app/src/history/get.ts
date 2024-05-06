import { SearchResultSerialized } from '../bang/duck';
import { RecursiveImmutableMap } from '../types';

export type StationHistory = {
  items: SearchResultSerialized[],
};

export type StationHistoryImmutable = RecursiveImmutableMap<StationHistory>;
export type StationHistoryItemImmutable = RecursiveImmutableMap<SearchResultSerialized>;
