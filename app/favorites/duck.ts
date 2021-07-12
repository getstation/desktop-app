import * as Immutable from 'immutable';

import { StationFavoriteImmutable, StationFavoritesImmutable } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

export const ADD = 'browserX/favorites/ADD';
export type ADD = 'browserX/favorites/ADD';
export const ADD_TAB = 'browserX/favorites/ADD_TAB';
export type ADD_TAB = 'browserX/favorites/ADD_TAB';
export const REMOVE = 'browserX/favorites/REMOVE';
export type REMOVE = 'browserX/favorites/REMOVE';
export const DELETE = 'browserX/favorites/DELETE';
export type DELETE = 'browserX/favorites/DELETE';
export const OPEN = 'browserX/favorites/OPEN';
export type OPEN = 'browserX/favorites/OPEN';

export type AddTabAsFavoriteAction = { type: ADD_TAB, tabId: string };
export type OpenFavoriteAction = { type: OPEN, favoriteId: string, newWindow: boolean };
export type AddFavoriteAction = {
  type: ADD,
  favoriteId: string,
  favicons: string[],
  title: string,
  url: string,
  applicationId: string,
};
export type RemoveFavoriteAction = { type: REMOVE, tabId: string | null, favoriteId: string };
export type DeleteFavoriteAction = { type: DELETE, favoriteId: string };
export type FavoriteActions =
  OpenFavoriteAction |
  AddFavoriteAction |
  RemoveFavoriteAction |
  DeleteFavoriteAction;

export const addTabAsFavorite = (tabId: string): AddTabAsFavoriteAction => ({
  type: ADD_TAB, tabId,
});

export const openFavorite = (favoriteId: string, newWindow:boolean = false): OpenFavoriteAction => ({
  type: OPEN, favoriteId, newWindow,
});

export const addFavorite = (
  favicons: string[],
  title: string,
  url: string,
  applicationId: string,
  favoriteId: string
): AddFavoriteAction => ({
  type: ADD, favoriteId, favicons, title, url, applicationId,
});

export const removeFavorite = (favoriteId: string, tabId: string | null): RemoveFavoriteAction => ({
  type: REMOVE, favoriteId, tabId,
});

export const deleteFavorite = (favoriteId: string): DeleteFavoriteAction => ({
  type: DELETE, favoriteId,
});

const defaultState = Immutable.Map({
  favorites: Immutable.Map(),
}) as StationFavoritesImmutable;
export default function favorites(state: StationFavoritesImmutable = defaultState, action: FavoriteActions): StationFavoritesImmutable {
  switch (action.type) {

    case ADD: {
      const { favoriteId, favicons, title, url, applicationId } = action;
      return state.setIn(['favorites', favoriteId], Immutable.Map({
        favoriteId, favicons: Immutable.List(favicons), title, url, applicationId,
      }) as StationFavoriteImmutable);
    }

    case DELETE: {
      return state.deleteIn(['favorites', action.favoriteId]) as StationFavoritesImmutable;
    }

    default:
      return state;

  }
}
