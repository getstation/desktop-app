import { Map } from 'immutable';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

export const READY = 'browserX/app/READY';
export const CHANGE_APP_FOCUS_STATE = 'browserX/app/CHANGE_APP_FOCUS_STATE';
export const SET_AUTO_LAUNCH_ENABLED = 'browserX/app/SET_AUTO_LAUNCH_ENABLED';
export const ENABLE_AUTO_LAUNCH = 'browserX/app/ENABLE_AUTO_LAUNCH';
export const SET_HIDE_MAIN_MENU = 'browserX/app/SET_HIDE_MAIN_MENU';
export const HIDE_MAIN_MENU = 'browserX/app/HIDE_MAIN_MENU';
export const SET_MINIMIZE_TO_TRAY = 'browserX/app/SET_MINIMIZE_TO_TRAY';
export const MINIMIZE_TO_TRAY = 'browserX/app/MINIMIZE_TO_TRAY';
export const INCLUDE_BETA_IN_UPDATES = 'browserX/app/INCLUDE_BETA_IN_UPDATES';
export const SET_INCLUDES_BETA_IN_UPDATES = 'browserX/app/SET_INCLUDES_BETA_IN_UPDATES';
export const SET_FULL_SCREEN_STATE = 'browserX/app/SET_FULL_SCREEN_STATE';
export const TOGGLE_MAXIMIZE = 'browserX/app/TOGGLE_MAXIMIZE';
export const SET_ONLINE_STATUS = 'browserX/app/SET_ONLINE_STATUS';
export const MAIN_APP_READY = 'browserX/app/MAIN_APP_READY';
export const TOGGLE_KBD_SHORTCUTS = 'browserX/app/TOGGLE_KBD_SHORTCUTS';
export const SET_KBD_SHORTCUTS_VISIBILITY = 'browserX/app/SET_KBD_SHORTCUTS_VISIBILITY';
export const SET_LOADING_SCREEN_VISIBILITY = 'browserX/app/SET_LOADING_SCREEN_VISIBILITY';
export const SET_IS_LOGGED_IN = 'browserX/app/SET_IS_LOGGED_IN';
export const SET_SHOW_LOGIN = 'browserX/app/SET_SHOW_LOGIN';
export const SET_DOWNLOAD_FOLDER = 'browserX/app/SET_DOWNLOAD_FOLDER';
export const SET_DEFAULT_DOWNLOAD_FOLDER = 'browserX/app/SET_DEFAULT_DOWNLOAD_FOLDER';
export const KEYBOARD_LAYOUT_CHANGE = 'browserX/app/KEYBOARD_LAYOUT_CHANGE';

export const OPEN_PROCESS_MANAGER = 'browserX/app/OPEN_PROCESS_MANAGER';

export const TOGGLE_PROMPT_DOWNLOAD = 'browserX/app/TOGGLE_PROMPT_DOWNLOAD';

export const SET_APP_METADATA = 'browserX/app/SET_APP_METADATA';
export const DISABLE_SSL_CERT_VERIFICATION = 'browserX/app/DISABLE_SSL_CERT_VERIFICATION';

// Action creators
export const ready = () => ({ type: READY });

// Use GenericWindowManager.focus(windowId: number)
export const changeAppFocusState = focus => ({
  type: CHANGE_APP_FOCUS_STATE, focus
});

export const setAutoLaunchEnabled = (enabled) => ({
  type: SET_AUTO_LAUNCH_ENABLED, enabled
});

export const enableAutoLaunch = (enable = true) => ({
  type: ENABLE_AUTO_LAUNCH, enable
});

export const setHideMainMenu = (hide) => ({
  type: SET_HIDE_MAIN_MENU, hide
});

export const hideMainMenu = (hide) => ({
  type: HIDE_MAIN_MENU, hide
});

export const setMinimizeToTray = (enabled) => ({
  type: SET_MINIMIZE_TO_TRAY, enabled
});

export const minimizeToTray = (enable) => ({
  type: MINIMIZE_TO_TRAY, enable
});

export const includeBetaInUpdates = (include = true) => ({
  type: INCLUDE_BETA_IN_UPDATES, include
});

export const setBetaIncludedInUpdates = included => ({
  type: SET_INCLUDES_BETA_IN_UPDATES, included
});

export const setFullScreenState = isFullScreen => ({
  type: SET_FULL_SCREEN_STATE,
  isFullScreen
});

export const setOnlineStatus = isOnline => ({
  type: SET_ONLINE_STATUS,
  isOnline
});

export const toggleMaximize = () => ({
  type: TOGGLE_MAXIMIZE
});

export const mainAppReady = () => ({
  type: MAIN_APP_READY
});

export const toggleKbdShortcuts = () => ({
  type: TOGGLE_KBD_SHORTCUTS
});

export const setKbdShortcutsVisibility = (isVisible) => ({
  type: SET_KBD_SHORTCUTS_VISIBILITY, isVisible
});

export const setLoadingScreenVisibility = (isVisible) => ({
  type: SET_LOADING_SCREEN_VISIBILITY, isVisible
});

export const setIsLoggedIn = (loggedIn) => ({
  type: SET_IS_LOGGED_IN, loggedIn
});

export const setShowLogin = (show) => ({
  type: SET_SHOW_LOGIN, show
});

export const setDownloadFolder = (downloadFolder) => ({
  type: SET_DOWNLOAD_FOLDER, downloadFolder,
});

export const setDefaultDownloadFolder = (defaultDownloadFolder) => ({
  type: SET_DEFAULT_DOWNLOAD_FOLDER, defaultDownloadFolder
});

export const keyboardLayoutChanged = (layout) => ({
  type: KEYBOARD_LAYOUT_CHANGE, layout,
});

export const openProcessManager = () => ({
  type: OPEN_PROCESS_MANAGER,
});

export const togglePromptDownload = (promptDownload) => ({
  type: TOGGLE_PROMPT_DOWNLOAD,
  promptDownload,
});

export const setAppMetadata = (metadata) => {
  const { name, version } = metadata;
  return {
    type: SET_APP_METADATA,
    name,
    version,
  };
};

export const disableSslCertVerification = (partition) => ({
  type: DISABLE_SSL_CERT_VERIFICATION,
  partition,
});

// Reducer
export default function app(state = new Map(), action) {
  switch (action.type) {
    case CHANGE_APP_FOCUS_STATE:
      return state.set('focus', action.focus);

    case SET_AUTO_LAUNCH_ENABLED:
      return state.set('autoLaunchEnabled', action.enabled);

    case SET_HIDE_MAIN_MENU:
      return state.set('hideMainMenu', action.hide);

    case SET_MINIMIZE_TO_TRAY:
      return state.set('minimizeToTray', action.enabled);
  
    case SET_INCLUDES_BETA_IN_UPDATES:
      return state.set('includesBetaInUpdates', action.included);

    case SET_FULL_SCREEN_STATE:
      return state.set('isFullScreen', action.isFullScreen);

    case SET_ONLINE_STATUS:
      return state.set('isOnline', action.isOnline);

    case SET_KBD_SHORTCUTS_VISIBILITY:
      return state.set('isKbdShortcutsOverlayVisible', action.isVisible);

    case SET_LOADING_SCREEN_VISIBILITY:
      return state.set('loadingScreenVisible', action.isVisible);

    case SET_IS_LOGGED_IN:
      return state.set('isLoggedIn', action.loggedIn);

    case SET_SHOW_LOGIN:
      return state.set('showLogin', action.show);

    case SET_DOWNLOAD_FOLDER:
      return state.set('downloadFolder', action.downloadFolder);

    case SET_DEFAULT_DOWNLOAD_FOLDER:
      return state.set('defaultDownloadFolder', action.defaultDownloadFolder);

    case KEYBOARD_LAYOUT_CHANGE:
      return state.set('keyboardLayout', action.layout);

    case TOGGLE_PROMPT_DOWNLOAD:
      return state.set('promptDownload', Boolean(action.promptDownload));

    case SET_APP_METADATA:
      return state
        .set('appName', action.name)
        .set('appVersion', action.version);

    default:
      return state;
  }
}
