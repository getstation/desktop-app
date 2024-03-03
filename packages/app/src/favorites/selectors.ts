import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { getFrontActiveTabId } from '../applications/utils';
import { getApplications } from '../applications/selectors';
import { removeHashFromURL } from '../tab-webcontents/api';
import { getTabById, getTabs, getTabMatchingURL } from '../tabs/selectors';
import { getTabApplicationId, getTabIsApplicationHome } from '../tabs/get';
import { StationState } from '../types';

import { StationFavoriteImmutable } from './types';

export const getFavorites = (state: StationState) =>
  state.getIn(['favorites', 'favorites']);

export const getFavorite = (state: StationState, favoriteId: string): StationFavoriteImmutable | undefined =>
  getFavorites(state).get(favoriteId);

export const getFavoritesForApplication = createCachedSelector(
  [getFavorites, (_state: StationState, applicationId: string) => applicationId],
  (favs, applicationId) => favs.filter(f => f.get('applicationId') === applicationId)
)((_state: StationState, applicationId: string) => applicationId);

export const getFavoritesForURL = (state: StationState, url: string) =>
  getFavorites(state).filter(f => removeHashFromURL(f.get('url')) === removeHashFromURL(url));

export const isURLAmongFavorites = (state: StationState, url: string) =>
  getFavoritesForURL(state, url).count() > 0;

export const getFavoriteMatchingTab = (state: StationState, id: string) => {
  const favorite = getFavorite(state, id);
  if (!favorite) return;

  const match = getTabMatchingURL(state, favorite.get('url'));
  return (match) ? match.tab : null;
};

export const isCurrentActiveTabAmongFavorites = (state: StationState): boolean => {
  const tabId = getFrontActiveTabId(state) || '';
  const tab = getTabById(state, tabId);
  if (!tab) return false;
  return isURLAmongFavorites(state, tab.get('url') || '');
};

export const getFavoritesWithApplications = createSelector(
  [getFavorites, getApplications, getTabs],
  (favorites, applications, tabs) => favorites
    .filter(
      (favorite: StationFavoriteImmutable) => {
        const tab = tabs.get(favorite.get('favoriteId'));

        return Boolean(tab) && applications.has(getTabApplicationId(tab!)) &&
          !getTabIsApplicationHome(tab!);
      }

    )
    .map(favorite => [favorite, applications.get(favorite.get('applicationId'))])
    .toList()
);

const getIdArgument = (_state: any, id: string) => id;

export const getFavoriteIdByTabId = createSelector(
  [getFavorites, getIdArgument],
  (favorites, tabId): string | null => {
    const favorite: StationFavoriteImmutable | undefined = favorites.find((fav) => fav.get('tabId') === tabId);
    if (favorite) {
      return favorite.get('favoriteId');
    }
    return null;
  }
);
