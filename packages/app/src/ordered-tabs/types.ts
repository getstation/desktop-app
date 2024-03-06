import { RecursiveImmutableMap } from '../types';

export type StationOrderedTabs = {
  applicationId: string,
  order: string[],
};

export type StationAllOrderedTabs = Partial<Record<string, StationOrderedTabs>>;
export type StationOrderedTabsImmutable = RecursiveImmutableMap<StationOrderedTabs>;
export type StationAllOrderedTabsImmutable = RecursiveImmutableMap<StationAllOrderedTabs>;
