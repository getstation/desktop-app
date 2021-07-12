import { Action } from 'redux';
import * as Immutable from 'immutable';
import { fromJS } from '../utils/ts';
import { DialogItem, DialogItemAction, DialogItemsImmutable, ExtendedDialogItem } from './types';

// Constants
export type ADD_ITEM = 'browserX/dialogs/ADD_ITEM';
export const ADD_ITEM = 'browserX/dialogs/ADD_ITEM';
export type CLICK_DIALOG = 'browserX/dialogs/CLICK_DIALOG';
export const CLICK_DIALOG = 'browserX/dialogs/CLICK_DIALOG';

// Action Types
export type AddItemAction = { type: ADD_ITEM } & DialogItem;
export type ClickDialogAction = {
  type: CLICK_DIALOG,
  dialog: ExtendedDialogItem,
  buttonClicked: DialogItemAction,
};

export function isClickDialogAction(action: Action): action is ClickDialogAction {
  return action.type === CLICK_DIALOG;
}

export type DialogActions = AddItemAction | ClickDialogAction;

// Action creators
export const addItem = (dialog: DialogItem): AddItemAction =>
  ({ type: ADD_ITEM, ...dialog });

export const clickDialog = (
  dialog: ExtendedDialogItem,
  buttonClicked: DialogItemAction
): ClickDialogAction => ({
  type: CLICK_DIALOG,
  dialog,
  buttonClicked,
});

// Reducer
const defaultState = Immutable.Map({}) as DialogItemsImmutable;

export default function reducer(
  state: DialogItemsImmutable = defaultState,
  action: DialogActions
) {
  switch (action.type) {
    case ADD_ITEM: {
      const { id, title, message, tabId, actions } = action;
      return state.set(id, fromJS({
        id,
        title,
        message,
        tabId,
        actions,
      }));
    }

    case CLICK_DIALOG: {
      const { dialog: { id } } = action;
      return state.delete(id);
    }

    default:
      return state;

  }
}
