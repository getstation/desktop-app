import { SagaIterator } from 'redux-saga';
import { all, call, fork, getContext, put, select } from 'redux-saga/effects';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import * as shortid from 'shortid';
import { BrowserXAppWorker } from '../../app-worker';
import { changeAppFocusState } from '../../app/duck';
import { changeSelectedAppMain } from '../../nav/duck';
import { getActiveApplicationId } from '../../nav/selectors';
import { detach } from '../../subwindows/duck';
import { hasSubwindow } from '../../subwindows/selectors';
import { executeWebviewMethod } from '../../tab-webcontents/duck';
import { getWebcontentsIdsByTabIds } from '../../tab-webcontents/selectors';
import { addTab } from '../../tabs/duck';
import { getTabApplicationId, getTabId } from '../../tabs/get';
import { getTabById, getTabIdsByApplicationId, getTabsForApplication } from '../../tabs/selectors';
import { callService, takeEveryWitness } from '../../utils/sagas';
import { getWindowIdFromTabId } from '../../windows/selectors';
import { getManifestOrTimeout } from '../api';
import {
  CHANGE_SELECTED_APP,
  changeSelectedApp,
  ChangeSelectedAppAction,
  CREATE_NEW_EMPTY_TAB,
  CREATE_NEW_TAB,
  CreateNewEmptyTabAction,
  createNewTab,
  CreateNewTabAction,
  NAVIGATE_TO_APPLICATION_TAB,
  NAVIGATE_TO_APPLICATION_TAB_AUTO,
  NAVIGATE_TO_TAB,
  navigateToApplicationTab,
  NavigateToApplicationTabAction,
  NavigateToApplicationTabAutoAction,
  navigateToTab,
  NavigateToTabAction,
  RESET_APPLICATION,
  RESET_ZOOM,
  ResetApplicationAction,
  SET_ACTIVE_TAB,
  SET_CONFIG_DATA,
  SET_HOME_TAB_AS_ACTIVE,
  setActiveTab,
  SetActiveTabAction,
  SetHomeTabAsActiveAction,
  uninstallApplication,
  ZOOM_IN,
  ZOOM_OUT,
  ZoomActions,
} from '../duck';
import { getApplicationActiveTab, getApplicationManifestURL, getApplicationZoomLevel, getConfigData } from '../get';
import { BxAppManifest } from '../manifest-provider/bxAppManifest';
import {
  getApplicationById,
  getApplicationFullConfigData,
  getHomeTab,
} from '../selectors';
import { getNewPageURL } from './helpers';
import { installApplication, watchLifecyleActions, InstallApplicationReturn } from './lifecycle';
import { goToStartUrlAfterSetConfigData, updateApplicationIconAfterSetConfigData } from './configData';
import { ApplicationImmutable } from '../types';

function* interceptZoomActions({ applicationId }: ZoomActions) {
  const application = yield select(getApplicationById, applicationId);

  if (!application) return undefined;
  const tabIds = yield select(getTabIdsByApplicationId, applicationId);
  const webcontentsIds = yield select(getWebcontentsIdsByTabIds, tabIds);
  const zoomLevel = getApplicationZoomLevel(application);

  for (const webcontentsId of webcontentsIds) {
    try {
      yield callService('tabWebContents', 'setZoomLevel', webcontentsId, zoomLevel);
    } catch (e) {
      console.warn(e);
    }
  }
}

function* setHomeTabAsActiveForApplication({ applicationId }: SetHomeTabAsActiveAction) {
  const application = yield select(getApplicationById, applicationId);
  if (!application) return;

  const homeTab = yield select(getHomeTab, applicationId);
  if (!homeTab) throw new Error(`No home tab for app ${applicationId}`);

  const currentTabId = getApplicationActiveTab(application);
  const homeTabId = getTabId(homeTab);

  if (currentTabId !== homeTabId) {
    // @ts-ignore:thunk
    yield put(navigateToApplicationTab(applicationId, homeTabId));
  }
}

function* sagaCreateNewTab({ applicationId, url, home, detach: shouldDetach, navigateToApplication }: CreateNewTabAction) {
  const id = shortid.generate();
  const tabId = `${applicationId}/${id}`;
  if (shouldDetach) {
    yield put(detach(tabId));
  }
  yield put(addTab(applicationId, tabId, url, home));

  if (navigateToApplication) {
    yield put(navigateToApplicationTab(applicationId, tabId));
  } else {
    // `navigateToTab`: will make the application navigate to the tab "in background"
    // `navigateToApplicationTab`: will make the application navigate to the tab
    // and Station navigate to the application
    // todo: add option in `CreateNewTabAction` to influence this behavior
    yield put(setActiveTab(applicationId, tabId));
  }
}

function* sagaCreateNewEmptyTab({ applicationId, home }: CreateNewEmptyTabAction) {
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');
  const application = yield select(getApplicationById, applicationId);
  if (!application) return;

  const configData = yield select(getApplicationFullConfigData, application);
  const manifestURL = getApplicationManifestURL(application);
  const manifest: BxAppManifest = yield call(getManifestOrTimeout, bxApp, manifestURL);

  const newPageUrl = yield call(getNewPageURL, manifest, applicationId, configData);

  yield put(createNewTab(applicationId, newPageUrl, { home, navigateToApplication: true }));
}

export function* focusActiveTab({ applicationId, tabId }: SetActiveTabAction) {
  const activeApplicationId = yield select(getActiveApplicationId);

  if (applicationId === activeApplicationId) {
    yield put(executeWebviewMethod(tabId, 'focus'));
  }
}

/**
 * React to `ResetApplication` actions.
 *
 * An application is reset by running the uninstallation and then the installation
 * successively.
 * Only the `installContext` is kept between the previous and the new application.
 */
export function* onResetApplication({ applicationId, via }: ResetApplicationAction) {
  yield put(updateUI('confirmResetApplicationModal', 'isVisible', false));

  const application: ApplicationImmutable = yield select(getApplicationById, applicationId);
  const manifestURL = getApplicationManifestURL(application);
  const immutableInstallContext = application.get('installContext');
  const installContext = immutableInstallContext ? immutableInstallContext.toJS() : undefined;
  const configData = getConfigData(application);

  // remember if the application was currently the active one
  const activeApplicationId = yield select(getActiveApplicationId);
  const isCurrentlyActive = activeApplicationId === applicationId;

  yield put(uninstallApplication(applicationId));
  const { applicationId: newApplicationId }: InstallApplicationReturn = yield call(
    installApplication,
    manifestURL,
    { ...configData, installContext }
  );

  if (isCurrentlyActive) {
    yield put(changeSelectedApp(newApplicationId, 'app-reset', false));
  }
}

function* sagaNavigateToApplicationTab({ applicationId, tabId, via, silent }: NavigateToApplicationTabAction): SagaIterator {
  yield put(changeSelectedApp(applicationId, via, false));
  yield put(navigateToTab(applicationId, tabId, silent));
}

function* sagaNavigateToTab({ applicationId, tabId, silent }: NavigateToTabAction): SagaIterator {
  const detached = yield select(hasSubwindow, tabId);
  const windowId = yield select(getWindowIdFromTabId, tabId);
  yield put(changeAppFocusState(windowId));
  if (!detached) {
    yield put(setActiveTab(applicationId, tabId, silent));
  }
}

function* sagaNavigateToApplicationTabAutomatically({ tabId, via, silent }: NavigateToApplicationTabAutoAction): SagaIterator {
  const tab = yield select(getTabById, tabId);
  if (!tab) return;
  const applicationId = getTabApplicationId(tab);
  return yield put(navigateToApplicationTab(applicationId, tabId, via, silent));
}

function* sagaChangeSelectedApp({ applicationId, via, markAsActiveTab }: ChangeSelectedAppAction): SagaIterator {
  const tabs = yield select(getTabsForApplication, applicationId);
  if (tabs.size === 1) {
    const tabId = getTabId(tabs.first());
    const isDetached = yield select(hasSubwindow, tabId);
    if (isDetached) {
      const windowId = yield select(getWindowIdFromTabId, tabId);
      yield put(changeAppFocusState(windowId));
      return;
    }
  }

  const application = yield select(getApplicationById, applicationId);
  const applicationActiveTabId = getApplicationActiveTab(application);

  yield put(changeSelectedAppMain(applicationId));

  if (markAsActiveTab) {
    yield put(setActiveTab(applicationId, applicationActiveTabId));
  }
}

export default function* main(bxApp: BrowserXAppWorker) {
  yield all([
    fork(watchLifecyleActions),
    takeEveryWitness([ZOOM_IN, ZOOM_OUT, RESET_ZOOM], interceptZoomActions),
    takeEveryWitness(SET_CONFIG_DATA, goToStartUrlAfterSetConfigData),
    takeEveryWitness(SET_CONFIG_DATA, updateApplicationIconAfterSetConfigData),
    takeEveryWitness(SET_ACTIVE_TAB, focusActiveTab),
    takeEveryWitness(RESET_APPLICATION, onResetApplication),
    takeEveryWitness(SET_HOME_TAB_AS_ACTIVE, setHomeTabAsActiveForApplication),
    takeEveryWitness(CREATE_NEW_EMPTY_TAB, sagaCreateNewEmptyTab),
    takeEveryWitness(CREATE_NEW_TAB, sagaCreateNewTab),
    takeEveryWitness(CHANGE_SELECTED_APP, sagaChangeSelectedApp),
    takeEveryWitness(NAVIGATE_TO_APPLICATION_TAB, sagaNavigateToApplicationTab),
    takeEveryWitness(NAVIGATE_TO_TAB, sagaNavigateToTab),
    takeEveryWitness(NAVIGATE_TO_APPLICATION_TAB_AUTO, sagaNavigateToApplicationTabAutomatically),
  ]);
}
