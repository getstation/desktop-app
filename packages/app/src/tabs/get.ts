import * as Immutable from 'immutable';
import { StationTabImmutable } from './types';

export const getTabId = (tab: StationTabImmutable) => tab.get('tabId');

export const getTabTitle = (tab: StationTabImmutable) => tab.get('title');

export const getTabBadge = (tab: StationTabImmutable) => tab.get('badge');

export const getTabURL = (tab: StationTabImmutable) => tab.get('url');

export const getTabIsApplicationHome = (tab: StationTabImmutable) => tab.get('isApplicationHome', false);

export const getTabApplicationId = (tab: StationTabImmutable) => tab.get('applicationId');

export const hasTabApplicationId = (tab: StationTabImmutable) => tab.has('applicationId');

export const getTabLoadTab = (tab: StationTabImmutable) => tab.get('loadTab', false);

export const getTabFavoriteId = (tab: StationTabImmutable) => tab.get('favoriteId');

export const getTabFavicons = (tab: StationTabImmutable) => tab.get('favicons', Immutable.List<string>() as any);

export const getFavicon = (tab: StationTabImmutable): string | null => {
  const favicons = getTabFavicons(tab);
  return (favicons && favicons.size) ? favicons.get(0) : null;
};

export const getTabLoadingState = (tab: StationTabImmutable) => tab.get('isLoading', false);

export const canTabGoBack = (tab: StationTabImmutable) => tab.get('canGoBack', false);

export const canTabGoForward = (tab: StationTabImmutable) => tab.get('canGoForward', false);

export const getLastPutToSleepAt = (tab: StationTabImmutable) => tab.get('lastPutToSleepAt');

export const getLastActivityAt = (tab: StationTabImmutable) => tab.get('lastActivityAt');

export const isIgnoredForBackHistory = (tab: StationTabImmutable) => tab.get('ignoreForBackHistory') || false;
