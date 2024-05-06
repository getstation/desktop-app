import { Map } from 'immutable';

export const ACTIVATE_FOR_CURRENT_TAB = 'browserX/in-tab-search/ACTIVATE_FOR_CURRENT_TAB';
export const activateForCurrentTab = () => ({ type: ACTIVATE_FOR_CURRENT_TAB });

export const FIND_IN_TAB = 'browserX/in-tab-search/FIND_IN_TAB';
export const findInTab = (tabId, searchString) => ({
  type: FIND_IN_TAB, tabId, searchString
});

export const FIND_NEXT_IN_TAB = 'browserX/in-tab-search/FIND_NEXT_IN_TAB';
export const findNext = tabId => ({
  type: FIND_NEXT_IN_TAB, tabId
});

export const STOP_FIND_IN_TAB = 'browserX/in-tab-search/STOP_FIND_IN_TAB';
export const stopFindInTab = tabId => ({
  type: STOP_FIND_IN_TAB, tabId
});

export const SET_ACTIVE_FOR_TAB = 'browserX/in-tab-search/SET_ACTIVE_FOR_TAB';
export const setActiveForTab = (tabId, active = true) => ({
  type: SET_ACTIVE_FOR_TAB, tabId, active
});

export const SET_ACTIVE_FOCUS_FOR_TAB = 'browserX/in-tab-search/SET_ACTIVE_FOCUS_FOR_TAB';
export const setActiveFocusForTab = (tabId, focus = true) => ({
  type: SET_ACTIVE_FOCUS_FOR_TAB, tabId, focus
});

export const SET_SEARCH_STRING_FOR_TAB = 'browserX/in-tab-search/SET_SEARCH_STRING_FOR_TAB';
export const setSearchStringForTab = (tabId, searchString) => ({
  type: SET_SEARCH_STRING_FOR_TAB, tabId, searchString
});

export const SET_SEARCH_RESULTS_FOR_TAB = 'browserX/in-tab-search/SET_SEARCH_RESULTS_FOR_TAB';
export const setSearchResultsForTab = (tabId, requestId, activeMatchOrdinal, matchesCount) => ({
  type: SET_SEARCH_RESULTS_FOR_TAB, tabId, requestId, activeMatchOrdinal, matchesCount
});
export const RESET_SEARCH_RESULTS_FOR_TAB = 'browserX/in-tab-search/RESET_SEARCH_RESULTS_FOR_TAB';
export const resetSearchResultsForTab = (tabId) => ({
  type: RESET_SEARCH_RESULTS_FOR_TAB, tabId
});

export default function inTabSearch(state = new Map(), action) {
  switch (action.type) {

    case SET_ACTIVE_FOR_TAB: {
      const { tabId, active } = action;
      return state.setIn([tabId, 'active'], active);
    }

    case SET_SEARCH_STRING_FOR_TAB: {
      const { tabId, searchString } = action;
      return state.setIn([tabId, 'searchString'], searchString);
    }

    case SET_SEARCH_RESULTS_FOR_TAB: {
      const { tabId, requestId, activeMatchOrdinal, matchesCount } = action;
      return state.setIn([tabId, 'results'], new Map({
        requestId, activeMatchOrdinal, matchesCount
      }));
    }

    case RESET_SEARCH_RESULTS_FOR_TAB: {
      const { tabId } = action;
      return state.setIn([tabId, 'results'], null);
    }

    case SET_ACTIVE_FOCUS_FOR_TAB: {
      const { tabId, focus } = action;
      return state.setIn([tabId, 'activeFocus'], focus);
    }

    default:
      return state;
  }
}
