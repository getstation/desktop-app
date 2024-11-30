import { createSelector } from 'reselect';
import { getApplicationActiveTab } from '../applications/get';
import { getActiveApplication, getApplications, getApplicationById } from '../applications/selectors';
import { isDone } from '../onboarding/selectors';
import { getTabApplicationId } from '../tabs/get';
import { RecursiveImmutableMap, StationState, StationRawState } from '../types';
import { getWindowCurrentTabId } from '../windows/get';
import { getWindow } from '../windows/selectors';
import { getTabs } from '../tabs/selectors';
import { StationTabImmutable } from '../tabs/types';

export type StationStatus = RecursiveImmutableMap<StationRawState['app']>;

// Improve : Type the state.app = StationStatus
export const getStationStatus = (state: StationState): StationStatus => state.get('app');

export const getAppAutoLaunchEnabledStatus = (state: StationState): boolean | undefined =>
  getStationStatus(state).get('autoLaunchEnabled');

export const getAppHideMainMenuStatus = (state: StationState): boolean | undefined =>
  getStationStatus(state).get('hideMainMenu');

export const getAppMinimizeToTrayStatus = (state: StationState): boolean | undefined =>
  getStationStatus(state).get('minimizeToTray');

export const areBetaIncludedInUpdates = (state: StationState): boolean =>
  state.getIn(['app', 'includesBetaInUpdates'], false);

export const isFullScreen = (state: StationState): boolean =>
  Boolean(state.getIn(['app', 'isFullScreen']));

export const getFocus = (state: StationState): number | undefined =>
  getStationStatus(state).get('focus');

export const getPromptDownloadEnabled = (state: StationState): boolean =>
  getStationStatus(state).get('promptDownload');

export const isOnline = (state: StationState): boolean =>
  Boolean(state.getIn(['app', 'isOnline']));

export const isKbdShortcutsOverlayVisible = (state: StationState): boolean =>
  Boolean(state.getIn(['app', 'isKbdShortcutsOverlayVisible'], false));

export const getActiveTabId = createSelector(
  getActiveApplication,
  application => application && getApplicationActiveTab(application)
);

export const getActiveTabByApplicationId = createSelector(
  getApplicationById,
  getTabs,
  (application, tabs): StationTabImmutable | undefined => {
    if (!application) return undefined;
    const tabId: string = application && getApplicationActiveTab(application) || '';
    return tabs.get(tabId);
  }
);

export const getFocusedTabId = (state: StationState): string | null | undefined => {
  const windowId = getFocus(state);

  if (!windowId) return null;
  const window = getWindow(state, windowId);

  if (!window) return null;
  return getWindowCurrentTabId(window);
};

export const getFocusedApplicationId = createSelector(
  getFocusedTabId,
  (state: StationState) => state.get('tabs'),
  (tabId, tabs) => {
    if (!tabId) return null;

    const tab = tabs.get(tabId);
    if (!tab) return null;

    return getTabApplicationId(tab);
  }
);

export const getFocusedApplication = createSelector(
  getFocusedApplicationId,
  getApplications,
  (applicationId, applications) => applications.get(applicationId!)
);

export const isLoadingScreenVisible = (state: StationState): boolean =>
  Boolean(state.getIn(['app', 'loadingScreenVisible']));

export const getShowLogin = (state: StationState): boolean =>
  state.getIn(['app', 'showLogin'], true);

export const isLoggedIn = (state: StationState): boolean =>
  state.getIn(['app', 'isLoggedIn'], false);

export const isFullyReady = createSelector(
  getShowLogin, isDone,
  (showLogin, onboardingDone) => !showLogin && onboardingDone
);

export const getDefaultDownloadFolder = (state: StationState): string =>
  state.getIn(['app', 'defaultDownloadFolder']);

export const getDownloadFolder = (state: StationState): string | undefined => {
  const status = getStationStatus(state);
  return status.get('downloadFolder') || status.get('defaultDownloadFolder');
};

export const isDownloadFolderChangedByUser = (state: StationState): boolean =>
  getDownloadFolder(state) !== getDefaultDownloadFolder(state);

export const getKeyboardLayout = (state: StationState): string =>
  state.getIn(['app', 'keyboardLayout'], '');

export const getKeyAboveTab = (state: StationState): string => {
  const appleCommonKeymap = {
    'com.apple.keylayout.French-PC': '²',
    'com.apple.keylayout.French': '@',
    'com.apple.keylayout.French-numerical': '@',
    'com.apple.keylayout.ABC-AZERTY': '@',
    'com.apple.keylayout.ABC': '`',
    'com.apple.keylayout.British': '`',
    'com.apple.keylayout.British-PC': '`',
    'com.apple.keylayout.USInternational-PC': '`',
    'com.apple.keylayout.US': '`',
  };
  const windowsCommonKeymap = {};
  const linuxCommonKeymap = {};

  const keymap = { ...appleCommonKeymap, ...windowsCommonKeymap, ...linuxCommonKeymap };
  return keymap[getKeyboardLayout(state)] || '';
};

export const getAppVersion = (state: StationState): string => state.getIn(['app', 'appVersion']) as string;
export const getAppName = (state: StationState): string => state.getIn(['app', 'appName']) as string;
