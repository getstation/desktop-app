import * as Immutable from 'immutable';
import {
  StationAllOrderedFavoritesImmutable,
  StationOrderedFavoritesImmutable,
} from './types';

export const PUSH_FAVORITE = 'browserX/ordered-favorites/PUSH_FAVORITE';
export type PUSH_FAVORITE = typeof PUSH_FAVORITE;
export const REMOVE_FAVORITE = 'browserX/ordered-favorites/REMOVE_FAVORITE';
export type REMOVE_FAVORITE = typeof REMOVE_FAVORITE;
export const REORDER_FAVORITE = 'browserX/ordered-favorites/REORDER_FAVORITE';
export type REORDER_FAVORITE = typeof REORDER_FAVORITE;

export type PushFavoriteAction = { type: PUSH_FAVORITE, applicationId: string, favoriteId: string };
export type DeleteFavoriteAction = { type: REMOVE_FAVORITE, applicationId: string, favoriteId: string };
export type ReorderFavoriteAction = { type: REORDER_FAVORITE, favoriteId: string, newPosition: number };

export type OrderedFavoritesActions = PushFavoriteAction | DeleteFavoriteAction | ReorderFavoriteAction;

export const pushFavorite = (applicationId: string, favoriteId: string): PushFavoriteAction => ({
  type: PUSH_FAVORITE,
  applicationId,
  favoriteId,
});

export const removeFavorite = (applicationId: string, favoriteId: string): DeleteFavoriteAction => ({
  type: REMOVE_FAVORITE,
  applicationId,
  favoriteId,
});

export const reorderFavorite = (favoriteId: string, newPosition: number): ReorderFavoriteAction => ({
  type: REORDER_FAVORITE,
  favoriteId,
  newPosition,
});

const getApplicationIdFromTabId = (state: StationAllOrderedFavoritesImmutable, favId: string): string | undefined => {
  const entry = state
    .find(app =>
      app.get('order')
      .find((id: string) => id === favId)
    );
  if (!entry) return undefined;
  return entry.get('applicationId');
};

export default function orderedFavoritesReducer(
  state: StationAllOrderedFavoritesImmutable = Immutable.Map() as any,
  action: OrderedFavoritesActions,
): StationAllOrderedFavoritesImmutable {
  switch (action.type) {
    case PUSH_FAVORITE: {
      const { favoriteId, applicationId } = action;

      // push favoriteId to the bottom of the list
      const nextOrder = state.getIn([applicationId, 'order'], Immutable.List([]) as any).concat([favoriteId]);

      return state.set(
        applicationId,
        Immutable.Map({
          applicationId,
          order: nextOrder,
        }) as any,
      );
    }

    case REMOVE_FAVORITE: {
      const { favoriteId } = action;
      return state
        .map((tabs: StationOrderedFavoritesImmutable) => // remove corresponding favoriteId
          tabs.set('order', tabs.get('order').filter(id => id !== favoriteId)) as any
        )
        .filter((tabs: StationOrderedFavoritesImmutable) => // remove application ordered tabs object when empty
          tabs.get('order').size > 0 as any
        );
    }

    case REORDER_FAVORITE: {
      const { favoriteId, newPosition } = action;
      const applicationId = getApplicationIdFromTabId(state, favoriteId);

      if (!applicationId) return state;

      const order = state.getIn([applicationId, 'order']);
      const position = order.findIndex((id: string) => favoriteId === id);
      const newOrder = order.delete(position).insert(newPosition, order.get(position));
      return state.setIn([applicationId, 'order'], newOrder as any);
    }

    default:
      return state;
  }
}
