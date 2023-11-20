import * as Immutable from 'immutable';
import { equals } from 'ramda';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { getFavoritesForApplication } from '../favorites/selectors';
import { getTabId } from '../tabs/get';
import { StationState } from '../types';
import { StationAllOrderedFavoritesImmutable, StationOrderedFavoritesImmutable } from './types';

const getFavorites = (state: StationState) => state.get('orderedFavorites');

const getOrderedFavoritesIdsForApplication = (state: StationState, applicationId: string) =>
  state.getIn(['orderedFavorites', applicationId, 'order'], Immutable.List([]) as any);

export const getOrderedFavoritesForApplicationId = createCachedSelector(
  [getFavoritesForApplication, getOrderedFavoritesIdsForApplication],
  (favorites, orderedFavorites) => {
    const res = orderedFavorites
      .map(favId => favorites.get(favId))
      .filter(Boolean)
      .map((fav: any) =>
        fav.set('id', `${getTabId(fav) || 'none'}_${fav.get('favoriteId') || 'none'}`)
      );

    return res;
  }
)(
  /*
   * Re-reselect resolver function.
   * Cache/call a new selector for each different "applicationId"
   */
  (_state, applicationId) => applicationId
);

export const getApplicationIdByFavoriteId = createSelector(
  [getFavorites, (_state: StationState, favoriteId: string) => favoriteId],
  (favoritesByApp: StationAllOrderedFavoritesImmutable, favoriteId: string): string | undefined => {
    const orderedFavorites: StationOrderedFavoritesImmutable | undefined =
      favoritesByApp.find((favorites: StationOrderedFavoritesImmutable) => {
        return Boolean(favorites.get('order').find(equals(favoriteId)));
      });
    if (!orderedFavorites) return undefined;
    return orderedFavorites.get('applicationId');
  }
);
