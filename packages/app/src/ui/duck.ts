import * as Immutable from 'immutable';

// Constants

export type SET_CURSOR_ICON = 'browserX/ui/SET_CURSOR_ICON';
export const SET_CURSOR_ICON = 'browserX/ui/SET_CURSOR_ICON';
export type TOGGLE_VISIBILITY = 'browserX/ui/TOGGLE_VISIBILITY';
export const TOGGLE_VISIBILITY = 'browserX/ui/TOGGLE_VISIBILITY';

// Action Types

export type SetCursorIcon = { type: SET_CURSOR_ICON, cursor: string };

export type ToggleVisibility = { type: TOGGLE_VISIBILITY, key: string[] };
export type UiActions = SetCursorIcon
  | ToggleVisibility;

// Action creators

export const setCursorIcon = (cursor: 'auto' | 'wait'): SetCursorIcon => ({
  type: SET_CURSOR_ICON, cursor,
});

export const toggleVisibility = (key: string[]): ToggleVisibility => ({
  type: TOGGLE_VISIBILITY, key,
});

// Reducer
const DEFAULT_MAP = Immutable.Map({
  cursorIcon: Immutable.Map({
    cursor: 'auto',
  }),
});
export default function notificationCenter(state: Immutable.Map<string, any> = DEFAULT_MAP, action: UiActions) {
  switch (action.type) {

    case SET_CURSOR_ICON: {
      return state.set('cursorIcon', action.cursor);
    }

    default:
      return state;

  }
}
