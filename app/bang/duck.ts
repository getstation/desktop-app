import { search } from '@getstation/sdk/';
import * as Immutable from 'immutable';

import { SearchSection } from '../sdk/search/types';
import { ActivityEntry } from '../activity/types';
import { Omit } from '../types';

import { SectionKinds } from './api';

// Types

export type SearchResultSerialized =
  Omit<search.SearchResultItem, 'onSelect'> & {
    type: SearchPaneItemSelectedItem,
    uniqId?: string,
    sectionKind: SectionKinds,
    onSelect?: boolean,
    themeColor?: string,
    associatedBxResource?: {
      bxResourceId: string,
    },
  };

export interface SearchSectionSerialized extends SearchSection {
  sectionKind: SectionKinds,
  results?: SearchResultSerialized[];
}

export type SearchPaneFormat = 'subdock' | 'center-modal';

export type SearchPaneOpenedVia =
  'topbar_menu_or_keyboard_shortcut' |
  'dedicated_button' |
  'autoOpenedOnStartup' |
  'recent-dock-icon-hover' |
  'held-ctrl-tab';

export type SearchPaneClosedVia =
  'topbar_menu_or_keyboard_shortcut' |
  'dedicated_button' |
  'item-selected' |
  'release-held-ctrl' |
  'click-outside' |
  'mouse-leave' |
  'keyboard-esc';

export type SearchPaneItemSelectedItem =
  'favorite' |
  'tab' |
  'station-app' |
  'integration-result';

export type SearchPaneItemSelectedVia =
  'keyboard-enter' |
  'click' |
  'click-recent-dock-icon' |
  'release-held-ctrl' |
  'quick-ctrl-tab';

export type SearchPaneItemsListCycleVia =
  'tab-on-held-ctrl' |
  'keyboard-arrow' |
  'keyboard-tab';

export type SearchPaneItemsListCycleDirection = 'up' | 'down';

// Constants

export const SET_SEARCH_SESSION_ID = 'browserX/bang/SET_SEARCH_SESSION_ID';
export type SET_SEARCH_SESSION_ID = 'browserX/bang/SET_SEARCH_SESSION_ID';
export const SET_SEARCH_VALUE = 'browserX/bang/SET_SEARCH_VALUE';
export type SET_SEARCH_VALUE = 'browserX/bang/SET_SEARCH_VALUE';
export const SET_SEARCH_RESULTS = 'browserX/bang/SET_SEARCH_RESULTS';
export type SET_SEARCH_RESULTS = 'browserX/bang/SET_SEARCH_RESULTS';
export const SET_INSERT_VISIBILITY = 'browserX/bang/SET_INSERT_VISIBILITY';
export type SET_INSERT_VISIBILITY = 'browserX/bang/SET_INSERT_VISIBILITY';
export const SET_VISIBILITY = 'browserX/bang/SET_VISIBILITY';
export type SET_VISIBILITY = 'browserX/bang/SET_VISIBILITY';
export const TOGGLE_VISIBILITY = 'browserX/bang/TOGGLE_VISIBILITY';
export type TOGGLE_VISIBILITY = 'browserX/bang/TOGGLE_VISIBILITY';
export const SELECT_ITEM = 'browserX/bang/SELECT_ITEM';
export type SELECT_ITEM = 'browserX/bang/SELECT_ITEM';

export const CYCLING_STEP = 'browserX/bang/CYCLING_STEP';
export type CYCLING_STEP = 'browserX/bang/CYCLING_STEP';

// Action Types

export type SetSearchSessionIdAction = { type: SET_SEARCH_SESSION_ID, searchSessionId: string };
export type SetSearchValueAction = { type: SET_SEARCH_VALUE, searchValue: string };
export type SetSearchResultsAction = { type: SET_SEARCH_RESULTS, results: SearchSectionSerialized[] };
export type SetInsertVisibilityAction = { type: SET_INSERT_VISIBILITY, visible: boolean };
export type SetVisibilityAction = {
  type: SET_VISIBILITY,
  format: SearchPaneFormat,
  visible: boolean,
  via?: SearchPaneOpenedVia | SearchPaneClosedVia,
};
export type ToggleVisibilityAction = { type: TOGGLE_VISIBILITY, format: SearchPaneFormat, via?: SearchPaneOpenedVia | SearchPaneClosedVia };
export type SelectItemAction = {
  type: SELECT_ITEM,
  item: SearchResultSerialized,
  position: number,
  via: SearchPaneItemSelectedVia,
  format: SearchPaneFormat,
  searchValue: string,
};
export type CyclingStepAction = {
  type: CYCLING_STEP,
  item: SearchResultSerialized | ActivityEntry,
  via?: SearchPaneItemsListCycleVia,
  format: SearchPaneFormat,
  position: number,
  direction: SearchPaneItemsListCycleDirection,
  searchValue: string,
};

export type BangActions =
  SetSearchSessionIdAction
  | SetSearchValueAction
  | SetSearchResultsAction
  | SetInsertVisibilityAction
  | SetVisibilityAction
  | ToggleVisibilityAction
  | SelectItemAction
  | CyclingStepAction;

// Helpers
const ensureItemHasType = (item: SearchResultSerialized | ActivityEntry): SearchResultSerialized =>
  item.type ? item : { ...item, type: 'integration-result' };

// Action creators

export const setSearchSessionId = (searchSessionId: string): SetSearchSessionIdAction => ({
  type: SET_SEARCH_SESSION_ID, searchSessionId,
});

export const setSearchValue = (searchValue: string): SetSearchValueAction => ({
  type: SET_SEARCH_VALUE, searchValue,
});

export const setSearchResults = (results: SearchSectionSerialized[]): SetSearchResultsAction => ({
  type: SET_SEARCH_RESULTS, results,
});

export const setInsertVisibility = (visible: boolean): SetInsertVisibilityAction => ({ type: SET_INSERT_VISIBILITY, visible });

export const setVisibility = (
  format: SearchPaneFormat,
  visible: boolean,
  via?: SearchPaneOpenedVia | SearchPaneClosedVia)
  : SetVisibilityAction =>
  ({ type: SET_VISIBILITY, format, visible, via });

export const toggleVisibility = (format: SearchPaneFormat, via: SearchPaneOpenedVia | SearchPaneClosedVia): ToggleVisibilityAction =>
  ({ type: TOGGLE_VISIBILITY, format, via });

export const selectItem = (
  item: SearchResultSerialized,
  index: number,
  via: SearchPaneItemSelectedVia,
  format: SearchPaneFormat,
  searchValue: string = '',
): SelectItemAction => ({
  type: SELECT_ITEM,
  item: ensureItemHasType(item),
  position: index,
  via,
  format,
  searchValue,
});

export const cyclingStep = (
  item: SearchResultSerialized | ActivityEntry,
  index: number,
  direction: SearchPaneItemsListCycleDirection,
  format: SearchPaneFormat,
  via?: SearchPaneItemsListCycleVia,
  searchValue: string = '',
): CyclingStepAction => ({
  type: CYCLING_STEP,
  item: ensureItemHasType(item),
  position: index,
  direction,
  format,
  via,
  searchValue,
});

// Reducer
export default function bang(state: Immutable.Map<string, any> = Immutable.Map(), action: BangActions) {
  switch (action.type) {
    case SET_SEARCH_SESSION_ID: {
      return state.set('searchSessionId', action.searchSessionId);
    }

    case SET_SEARCH_VALUE: {
      return state.set('searchValue', action.searchValue);
    }

    case SET_SEARCH_RESULTS: {
      return state.set('results', Immutable.fromJS(action.results));
    }

    case SET_INSERT_VISIBILITY: {
      return state.set('showInsert', action.visible);
    }

    case SET_VISIBILITY: {
      if (action.format === 'subdock') return state;
      return state.set('isVisible', action.visible);
    }

    default:
      return state;
  }
}
