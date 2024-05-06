import { RecursiveImmutableMap } from '../types';

export type StationTab = {
  tabId: string,
  applicationId: string,
  title?: string,
  badge?: string | number | null,
  url?: string,
  isApplicationHome: boolean,
  loadTab?: boolean,
  favicons: string[],
  isLoading: boolean,
  canGoBack: boolean,
  canGoForward: boolean,
  lastPutToSleepAt?: number,
  lastActivityAt?: number,
  isDetached?: boolean,
  ignoreForBackHistory?: boolean,
};
export type StationTabs = Partial<Record<string, StationTab>>;
export type StationTabImmutable = RecursiveImmutableMap<StationTab>;
export type StationTabsImmutable = RecursiveImmutableMap<StationTabs>;
