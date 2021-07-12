import * as Immutable from 'immutable';
import isEmpty = require('is-empty');
import { ImmutableList } from '../types';
import { StationTabImmutable, StationTabsImmutable } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

export const ADD = 'browserX/tabs/ADD';
export type ADD = 'browserX/tabs/ADD';
export const CLOSE = 'browserX/tabs/CLOSE';
export type CLOSE = 'browserX/tabs/CLOSE';
export const CLOSE_CURRENT_TAB = 'browserX/tabs/CLOSE_CURRENT_TAB';
export type CLOSE_CURRENT_TAB = 'browserX/tabs/CLOSE_CURRENT_TAB';
export const IGNORE_FOR_BACK_HISTORY = 'browserX/tabs/IGNORE_FOR_BACK_HISTORY';
export type IGNORE_FOR_BACK_HISTORY = 'browserX/tabs/IGNORE_FOR_BACK_HISTORY';
export const REMOVE = 'browserX/tabs/REMOVE';
export type REMOVE = 'browserX/tabs/REMOVE';
export const CLOSE_ALL_IN_APP = 'browserX/tabs/CLOSE_ALL_IN_APP';
export type CLOSE_ALL_IN_APP = 'browserX/tabs/CLOSE_ALL_IN_APP';
export const UPDATE_TITLE = 'browserX/tabs/UPDATE_TITLE';
export type UPDATE_TITLE = 'browserX/tabs/UPDATE_TITLE';
export const UPDATE_URL = 'browserX/tabs/UPDATE_URL';
export type UPDATE_URL = 'browserX/tabs/UPDATE_URL';
export const UPDATE_BADGE = 'browserX/tabs/UPDATE_BADGE';
export type UPDATE_BADGE = 'browserX/tabs/UPDATE_BADGE';
export const UPDATE_FAVICONS = 'browserX/tabs/UPDATE_FAVICONS';
export type UPDATE_FAVICONS = 'browserX/tabs/UPDATE_FAVICONS';
export const UPDATE_LOADING_STATE = 'browserX/tabs/UPDATE_LOADING_STATE';
export type UPDATE_LOADING_STATE = 'browserX/tabs/UPDATE_LOADING_STATE';
export const UPDATE_BACK_FORWARD_STATE = 'browserX/tabs/UPDATE_BACK_FORWARD_STATE';
export type UPDATE_BACK_FORWARD_STATE = 'browserX/tabs/UPDATE_BACK_FORWARD_STATE';
export const UPDATE_LAST_PUT_TO_SLEEP_AT = 'browserX/tabs/UPDATE_LAST_PUT_TO_SLEEP_AT';
export type UPDATE_LAST_PUT_TO_SLEEP_AT = 'browserX/tabs/UPDATE_LAST_PUT_TO_SLEEP_AT';
export const UPDATE_LAST_ACTIVITY = 'browserX/tabs/UPDATE_LAST_ACTIVITY';
export type UPDATE_LAST_ACTIVITY = 'browserX/tabs/UPDATE_LAST_ACTIVITY';

// Action Types

export type addTabAction = { type: ADD, applicationId: string, tabId: string, url: string, isApplicationHome: boolean };
export type closeTabAction = { type: CLOSE, tabId: string, navigation: AfterCloseTabNavigation };
export type closeCurrentTabAction = { type: CLOSE_CURRENT_TAB, via: string };
export type ignoreForBackHistoryTabAction = { type: IGNORE_FOR_BACK_HISTORY, tabId: string };
export type removeTabAction = { type: REMOVE, applicationId: string, tabId: string };
export type closeAllTabsInAppAction = { type: CLOSE_ALL_IN_APP, applicationId: string };
export type updateTabTitleAction = { type: UPDATE_TITLE, tabId: string, title: string };
export type updateTabURLAction = { type: UPDATE_URL, tabId: string, url: string };
export type updateTabBadgeAction = { type: UPDATE_BADGE, tabId: string, badge: string };
export type updateTabFaviconsAction = { type: UPDATE_FAVICONS, tabId: string, favicons: Immutable.List<any> };
export type updateLoadingStateAction = { type: UPDATE_LOADING_STATE, tabId: string, isLoading: boolean };
export type updateBackForwardStateAction = { type: UPDATE_BACK_FORWARD_STATE, tabId: string, canGoBack: boolean, canGoForward: boolean };
export type updateLastPutToSleepAtAction = { type: UPDATE_LAST_PUT_TO_SLEEP_AT, tabId: string, lastPutToSleepAt: number };
export type updateLastActivityAction = { type: UPDATE_LAST_ACTIVITY, tabId: string, lastActivityAt: number };
export type TabsActions =
  addTabAction
  | closeTabAction
  | closeCurrentTabAction
  | ignoreForBackHistoryTabAction
  | removeTabAction
  | closeAllTabsInAppAction
  | updateTabTitleAction
  | updateTabURLAction
  | updateTabBadgeAction
  | updateTabFaviconsAction
  | updateLoadingStateAction
  | updateBackForwardStateAction
  | updateLastPutToSleepAtAction
  | updateLastActivityAction;

// Enums

export enum AfterCloseTabNavigation {
  Default,
  PreviousFocusedPage,
}

// Action creators

export const addTab = (applicationId: string, tabId: string, url: string, isApplicationHome: boolean = false): addTabAction => ({
  type: ADD, tabId, applicationId, isApplicationHome, url,
});

export const closeTab = (
  tabId: string,
  navigation: AfterCloseTabNavigation = AfterCloseTabNavigation.Default
): closeTabAction => ({
  type: CLOSE, tabId, navigation,
});

export const closeCurrentTab = (via: 'click' | 'keyboard-shortcut'): closeCurrentTabAction => ({
  type: CLOSE_CURRENT_TAB, via,
});

export const ignoreForBackHistory = (tabId: string): ignoreForBackHistoryTabAction => ({
  type: IGNORE_FOR_BACK_HISTORY, tabId,
});

/**
 * @private
 * @use closeTab
 * @description closeTab cleanup logic (favs, orderedTabs...)
 * while removeTab remove the tab in state only
 */
export const removeTab = (applicationId: string, tabId: string): removeTabAction => ({
  type: REMOVE, applicationId, tabId,
});

export function closeAllTabsInApp(applicationId: string): closeAllTabsInAppAction {
  return { type: CLOSE_ALL_IN_APP, applicationId };
}

export function updateTabTitle(tabId: string, title: string): updateTabTitleAction {
  return { type: UPDATE_TITLE, tabId, title };
}

export function updateTabURL(tabId: string, url: string): updateTabURLAction {
  return { type: UPDATE_URL, tabId, url };
}

export function updateTabBadge(tabId: string, badge: string): updateTabBadgeAction {
  return { type: UPDATE_BADGE, tabId, badge };
}

export function updateTabFavicons(tabId: string, favicons: Immutable.List<any>): updateTabFaviconsAction {
  return { type: UPDATE_FAVICONS, tabId, favicons };
}

export function updateLoadingState(tabId: string, isLoading: boolean): updateLoadingStateAction {
  return { type: UPDATE_LOADING_STATE, tabId, isLoading };
}

export function updateBackForwardState(tabId: string, canGoBack: boolean, canGoForward: boolean): updateBackForwardStateAction {
  return { type: UPDATE_BACK_FORWARD_STATE, tabId, canGoBack, canGoForward };
}

export function updateLastPutToSleepAt(tabId: string, lastPutToSleepAt: number): updateLastPutToSleepAtAction {
  return { type: UPDATE_LAST_PUT_TO_SLEEP_AT, tabId, lastPutToSleepAt };
}

export function updateLastActivity(tabId: string, lastActivityAt: number): updateLastActivityAction {
  return { type: UPDATE_LAST_ACTIVITY, tabId, lastActivityAt };
}

// Reducer

export default function tabs(state: StationTabsImmutable = Immutable.Map() as any, action: TabsActions): StationTabsImmutable {
  switch (action.type) {
    case ADD: {
      const {
        tabId,
        applicationId,
        url,
        isApplicationHome,
      } = action;
      return state.set(tabId, <StationTabImmutable>Immutable.Map({
        tabId,
        applicationId,
        url,
        isApplicationHome,
      }));
    }

    case REMOVE: {
      const { tabId } = action;
      return state.remove(tabId);
    }

    case IGNORE_FOR_BACK_HISTORY: {
      const { tabId } = action;
      if (!state.has(tabId)) return state;

      return state.setIn([tabId, 'ignoreForBackHistory'], true);
    }

    case UPDATE_TITLE: {
      const { tabId, title } = action;
      if (!state.has(tabId)) return state;
      return state.setIn([tabId, 'title'], title);
    }

    case UPDATE_URL: {
      const { tabId, url } = action;
      if (!state.has(tabId)) return state;
      return state.setIn([tabId, 'url'], url);
    }

    case UPDATE_BADGE: {
      const { tabId, badge } = action;
      if (!state.has(tabId)) return state;
      return state.setIn([tabId, 'badge'], normalizedBadgeValue(badge));
    }

    case UPDATE_FAVICONS: {
      const { tabId, favicons } = action;
      if (!state.has(tabId)) return state;
      return state.setIn([tabId, 'favicons'], <ImmutableList<string[]>>Immutable.List(favicons || []));
    }

    case UPDATE_LOADING_STATE: {
      const { tabId, isLoading } = action;
      if (!state.has(tabId)) return state;
      return state.setIn([tabId, 'isLoading'], isLoading);
    }

    case UPDATE_BACK_FORWARD_STATE: {
      const { tabId, canGoBack, canGoForward } = action;
      if (!state.has(tabId)) return state;
      return state
        .setIn([tabId, 'canGoBack'], canGoBack)
        .setIn([tabId, 'canGoForward'], canGoForward);
    }

    case UPDATE_LAST_PUT_TO_SLEEP_AT: {
      const { tabId, lastPutToSleepAt } = action;
      if (!state.has(tabId)) return state;
      return state
        .setIn([tabId, 'lastPutToSleepAt'], lastPutToSleepAt);
    }

    case UPDATE_LAST_ACTIVITY: {
      const { tabId, lastActivityAt } = action;
      if (!state.has(tabId)) return state;
      return state.setIn([tabId, 'lastActivityAt'], lastActivityAt)
        .setIn([tabId, 'ignoreForBackHistory'], false);
    }

    default:
      return state;
  }
}

const normalizedBadgeValue = (badge: string) => {
  if (isEmpty(badge)) return null;
  if (!isNaN(parseInt(badge, 10))) return parseInt(badge, 10);
  return badge;
};
