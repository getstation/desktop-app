// Constants

export type SHOW_APP_STORE = 'browserX/app-store/SHOW_APP_STORE';
export const SHOW_APP_STORE = 'browserX/app-store/SHOW_APP_STORE';
export type TOGGLE_VISIBILITY = 'browserX/app-store/TOGGLE_VISIBILITY';
export const TOGGLE_VISIBILITY = 'browserX/app-store/TOGGLE_VISIBILITY';

// Action Types

export type ShowAppStoreAction = { type: SHOW_APP_STORE, visible: boolean };
export type ToggleVisibilityAction = { type: TOGGLE_VISIBILITY };

// Action creators

export const showAppStore = (visible: boolean): ShowAppStoreAction => ({ type: SHOW_APP_STORE, visible });

export const toggleVisibility = (): ToggleVisibilityAction => ({ type: TOGGLE_VISIBILITY });
