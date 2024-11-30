import ms from 'ms';
// import KeyboardLayout from '@axosoft/keyboard-layout';
import { eventChannel } from 'redux-saga';
import { delay } from 'redux-saga/effects';
import {
  all,
  call,
  cancel,
  fork,
  put,
  race,
  select,
  take
} from 'redux-saga/effects';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { DOM_READY, executeWebviewMethod } from '../tab-webcontents/duck';
import { getTabWebcontentsByWebContentsId } from '../tab-webcontents/selectors';
import { setVisibility as setBangVisibility } from '../bang/duck';
import { closeTab } from '../tabs/duck';
import {
  callService,
  serviceAddObserverChannel,
  takeEveryWitness,
} from '../utils/sagas';
import {
  CHANGE_APP_FOCUS_STATE,
  ENABLE_AUTO_LAUNCH, enableAutoLaunch,
  HIDE_MAIN_MENU, hideMainMenu,
  MINIMIZE_TO_TRAY, minimizeToTray,
  INCLUDE_BETA_IN_UPDATES,
  keyboardLayoutChanged,
  OPEN_PROCESS_MANAGER,
  READY,
  setAppMetadata,
  setBetaIncludedInUpdates,
  setKbdShortcutsVisibility,
  setLoadingScreenVisibility,
  TOGGLE_PROMPT_DOWNLOAD,
  TOGGLE_KBD_SHORTCUTS,
  TOGGLE_MAXIMIZE,
  DISABLE_SSL_CERT_VERIFICATION,
} from './duck';
import { DELAY } from '../persistence/backend';
import { getWindowCurrentTabId } from '../windows/get';
import { getWindow } from '../windows/selectors';
import {
  getAppAutoLaunchEnabledStatus,
  getAppHideMainMenuStatus,
  getAppMinimizeToTrayStatus,
  getPromptDownloadEnabled,
  isFullyReady,
  isKbdShortcutsOverlayVisible
} from './selectors';
import { getTabIdMatchingURL } from '../tabs/selectors';
import { isSubdockOpen } from '../auto-update/selectors';
import services from '../services/servicesManager';

function* sagaPrepareQuit(bxApp) {
  const prepareQuitChannel = serviceAddObserverChannel(
    services.electronApp,
    'onPrepareQuit',
    'saga-prepare-quit'
  );

  yield takeEveryWitness(prepareQuitChannel, function* handle() {
    // Here we pause the state persistor to ensure that the debounce in each `StateProxy`
    // will have time to fulfill
    bxApp.store.persistor.pause();
    yield delay(DELAY); // Wait for persistence to flush

    // We tell app that we do not want to prevent `quit` event anymore
    yield callService('electronApp', 'canResumeQuit');
    // Install and restart the app if update is pending, or just quit the app otherwise
    yield callService('autoUpdater', 'quitAndInstall');
  });
}

function* sagaSyncAutoLaunch() {
  let isEnabled = yield select(getAppAutoLaunchEnabledStatus);
  if (typeof isEnabled === 'undefined') {
    // the settings is not defined:
    // by default we activate the autoLauncher
    isEnabled = true;
  }

  yield put(enableAutoLaunch(isEnabled));
}

function* sagaEnableAutoLaunch({ enable }) {
  yield call([services.autolaunch, services.autolaunch.set], enable);
}

function* sagaSyncHideMainMenu() {
  let isHide = yield select(getAppHideMainMenuStatus);
  if (typeof isHide === 'undefined') {
    isHide = false;
  }

  yield put(hideMainMenu(isHide));
}

function* sagaHideMainMenu({ hide }) {
  yield call([services.browserWindow, services.browserWindow.hideMainMenu], hide);
}

function* sagaSyncMinimizeToTray() {
  let isEnabled = yield select(getAppMinimizeToTrayStatus);
  if (typeof isEnabled === 'undefined') {
    isEnabled = false;
  }

  yield put(minimizeToTray(isEnabled));
}

function* sagaMinimizeToTray({ enable }) {
  if (enable) {
    yield call([services.electronApp, services.electronApp.showTrayIcon]);
  }
  else {
    yield call([services.electronApp, services.electronApp.hideTrayIcon]);
  }
}

function* sagaTogglePromptDownload({ promptDownload }) {
  yield call(
    [services.download, services.download.setShouldShowPromptPathOnDownload],
    promptDownload
  );
}

function* sagaSyncPromptDownload() {
  const enabled = yield select(getPromptDownloadEnabled);
  yield call(
    [services.download, services.download.setShouldShowPromptPathOnDownload],
    enabled
  );
}

function* sagaIncludeBetaInUpdates({ include }) {
  yield put(setBetaIncludedInUpdates(include));
}

function* sagaSendToggleMaximize() {
  const windowService = yield callService('browserWindow', 'getFocusedWindow');
  yield call([windowService, windowService.toggleMaximize]);
}

function* sagaToggleKbdShortcutsOverlay() {
  const isVisible = yield select(isKbdShortcutsOverlayVisible);
  const newIsVisible = !isVisible;

  yield put(setKbdShortcutsVisibility(newIsVisible));
}

function* sagaLoadingScreen() {
  yield put(setLoadingScreenVisibility(true));

  // we let the onboarding flow deal with removing the onbaording screen
  yield take(REHYDRATION_COMPLETE);
  const loggedInAndReady = yield select(isFullyReady);
  if (!loggedInAndReady) {
    yield put(setLoadingScreenVisibility(false));
    return undefined;
  }

  const { domReady } = yield race({
    domReady: take(DOM_READY),
    timeout: delay(ms('10sec'))
  });

  if (domReady) {
    // Most of the time, when 'dom-ready' is triggered, the webview is still blank,
    // so we wait a little longer
    yield delay(1500);
  }

  yield put(setLoadingScreenVisibility(false));

  const isReleaseNotesSubdockVisible = yield select(isSubdockOpen);
  if (!isReleaseNotesSubdockVisible) {
    yield put(setBangVisibility('center-modal', true, 'autoOpenedOnStartup'));
  }
}

/**
 * Close the tab that was actually a download.
 *
 * Will intercept the completed request, check if it's a download
 * and close the tab corresponding to the `webContents` that was the download.
 */
function* sagaHandleDownloadDialog() {
  const webRequestOnCompletedChannel = serviceAddObserverChannel(
    services.download,
    'onRequestCompleted',
    'download-dialog'
  );

  yield takeEveryWitness(webRequestOnCompletedChannel, function*(
    requestDetails
  ) {
    if (requestDetails.webContentsId) {
      // if the webContents has history we should understand that the window.location has been set directly
      // and we don't want to close the tab
      if (!requestDetails.hasEmptyHistory) return;
      const tab = yield select(
        getTabWebcontentsByWebContentsId,
        requestDetails.webContentsId
      );
      if (!tab) return;
      yield put(closeTab(tab.get('tabId')));
    } else if (requestDetails.url) {
      if (!requestDetails.hasEmptyHistory) return;
      // Some download request do not have a `webContentsId`,
      // but we can guess the `tabId` through the `url`.
      const match = yield select(getTabIdMatchingURL, requestDetails.url);
      if (match) {
        yield put(closeTab(match.tabId));
      }
    }
  });
}

// const observeKeyboardLayout = emitter => {
//   let firstValueEmitted = false;
//   KeyboardLayout.observeCurrentKeyboardLayout(layout => {
//     if (firstValueEmitted) {
//       emitter(layout);
//     } else {
//       setImmediate(() => {
//         emitter(layout);
//         firstValueEmitted = true;
//       });
//     }
//   });
// };

// const createKeyboardLayoutChannel = () =>
//   eventChannel(emitter => {
//     const subscription = observeKeyboardLayout(emitter);
//     return () => subscription.dispose();
//   });

// function* sagaHandleKeyboardLayout() {
//   const keyboardLayoutChannel = createKeyboardLayoutChannel();
//   yield takeEveryWitness(keyboardLayoutChannel, function*(layout) {
//     yield put(keyboardLayoutChanged(layout));
//   });
// }

/**
 * For dev purpose.
 * To trigger it, connect to redux devtool and fire the following action:
 * {
 *   type: 'STATION_MANUAL_ERR'
 * }
 */
function* sagaTriggerError() {
  yield;
  throw new Error('Manually triggered error for test purpose');
}

function* onChangeAppFocusState({ focus }) {
  if (focus === null) return;
  const window = yield select(getWindow, focus);
  const tabId = getWindowCurrentTabId(window);
  yield put(executeWebviewMethod(tabId, 'focus'));
}

function* sagaHandleOpenProcessManager() {
  yield callService('processManager', 'open', undefined);
}

function* sagaDisableSslCertVerification({ partition }) {
  yield callService('defaultSession', 'disableSslCertVerification', partition);
}

/**
 * Will load the app metadata in the state.
 */
function* sagaLoadAppMetadata() {
  const metadata = yield callService('electronApp', 'getAppMetadata');
  yield put(setAppMetadata(metadata));
}

export default function* main(bxApp) {
  yield all([
    takeEveryWitness(READY, sagaLoadingScreen),
    takeEveryWitness(READY, sagaHandleDownloadDialog),
    // takeEveryWitness(READY, sagaHandleKeyboardLayout),
    takeEveryWitness(READY, sagaLoadAppMetadata),
    takeEveryWitness(READY, sagaPrepareQuit, bxApp),
    takeEveryWitness(REHYDRATION_COMPLETE, sagaSyncAutoLaunch),
    takeEveryWitness(REHYDRATION_COMPLETE, sagaSyncHideMainMenu),
    takeEveryWitness(REHYDRATION_COMPLETE, sagaSyncMinimizeToTray),
    takeEveryWitness(REHYDRATION_COMPLETE, sagaSyncPromptDownload),
    takeEveryWitness(ENABLE_AUTO_LAUNCH, sagaEnableAutoLaunch),
    takeEveryWitness(HIDE_MAIN_MENU, sagaHideMainMenu),
    takeEveryWitness(MINIMIZE_TO_TRAY, sagaMinimizeToTray),
    takeEveryWitness(TOGGLE_PROMPT_DOWNLOAD, sagaTogglePromptDownload),
    takeEveryWitness(INCLUDE_BETA_IN_UPDATES, sagaIncludeBetaInUpdates),
    takeEveryWitness(TOGGLE_MAXIMIZE, sagaSendToggleMaximize),
    takeEveryWitness(TOGGLE_KBD_SHORTCUTS, sagaToggleKbdShortcutsOverlay),
    takeEveryWitness(CHANGE_APP_FOCUS_STATE, onChangeAppFocusState),
    takeEveryWitness(OPEN_PROCESS_MANAGER, sagaHandleOpenProcessManager),
    takeEveryWitness(DISABLE_SSL_CERT_VERIFICATION, sagaDisableSslCertVerification),
    // For dev purpose
    takeEveryWitness('STATION_MANUAL_ERR', sagaTriggerError)
  ]);
}
