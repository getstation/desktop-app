/**
 * This duck contains a Map of all BrowserWindow with the following information:
 * - Is this window the main window: `isMain`
 * - What is the currently visible tabId of this window: `currentTabId`
 */

import { Map } from 'immutable';

export const CREATED = 'browserX/windows/CREATED';
export const DELETED = 'browserX/windows/DELETED';
export const UPDATE_TAB_ID = 'browserX/windows/UPDATE_TAB_ID';

export const windowCreated = (windowId, isMain = false) => ({
  type: CREATED, windowId, isMain
});

export const windowDeleted = windowId => ({
  type: DELETED, windowId
});

export const updateTabId = (windowId, tabId) => ({
  type: UPDATE_TAB_ID, windowId, tabId
});


export default function webviews(state = new Map(), action) {
  switch (action.type) {

    case CREATED: {
      const { windowId, isMain } = action;
      return state.set(windowId, new Map({
        isMain
      }));
    }

    case UPDATE_TAB_ID: {
      const { windowId, tabId } = action;
      if (!state.has(windowId)) return state;
      return state.setIn([windowId, 'currentTabId'], tabId);
    }

    case DELETED: {
      return state.delete(action.windowId);
    }

    default:
      return state;
  }
}
