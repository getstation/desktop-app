import * as Immutable from 'immutable';
import { StationDockImmutable } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Actions
export const ADD_APP_ITEM = 'browserX/dock/ADD_APP_ITEM';
export type ADD_APP_ITEM = 'browserX/dock/ADD_APP_ITEM';
export const REMOVE_APP_ITEM = 'browserX/dock/REMOVE_APP_ITEM';
export type REMOVE_APP_ITEM = 'browserX/dock/REMOVE_APP_ITEM';
export const CHANGE_APP_ITEM_POSITION = 'browserX/dock/CHANGE_APP_ITEM_POSITION';
export type CHANGE_APP_ITEM_POSITION = 'browserX/dock/CHANGE_APP_ITEM_POSITION';

// Actions Types
export type addAppItem = { type: ADD_APP_ITEM, applicationId: string };
export type removeAppItem = { type: REMOVE_APP_ITEM, applicationId: string };
export type changeAppItemPosition = { type: CHANGE_APP_ITEM_POSITION, applicationId: string, index: number };
export type DockActions =
  addAppItem
  | removeAppItem
  | changeAppItemPosition;

// Action creators
export const addAppItem = (applicationId: string) => ({
  type: ADD_APP_ITEM,
  applicationId,
});
export const removeAppItem = (applicationId: string) => ({
  type: REMOVE_APP_ITEM,
  applicationId,
});
export const changeAppItemPosition = (applicationId: string, index: number) => ({
  type: CHANGE_APP_ITEM_POSITION,
  applicationId,
  index,
});

// Reducer
export default function reducer(state: StationDockImmutable = Immutable.List() as any, action: DockActions): StationDockImmutable {
  switch (action.type) {
    case ADD_APP_ITEM:
      return state.includes(action.applicationId) ?
        state :
        state.push(action.applicationId) as StationDockImmutable;

    case REMOVE_APP_ITEM: {
      const index = state.indexOf(action.applicationId);
      if (index !== -1) {
        return state.remove(index);
      }
      return state;
    }

    case CHANGE_APP_ITEM_POSITION:
      return state
        .remove(state.indexOf(action.applicationId))
        .insert(action.index, action.applicationId) as StationDockImmutable;

    default:
      return state;
  }
}
