import { ipcRenderer } from 'electron';
import { delay, SagaIterator } from 'redux-saga';
import { all, call, getContext, put, race, select, spawn, take } from 'redux-saga/effects';
import { BrowserXAppWorker } from '../../app-worker';
import { MAIN_APP_READY } from '../../app/duck';
import { getFocusedTabId } from '../../app/selectors';
import { isAlwaysLoaded } from '../../application-settings/api';
import { getApplicationsSettings } from '../../application-settings/selectors';
import { ApplicationsSettingsImmutable } from '../../application-settings/types';
import { getAllManifests } from '../../applications/api';
import { navigateToApplicationTabAutomatically } from '../../applications/duck';
import { getApplicationId } from '../../applications/get';
import { BxAppManifest } from '../../applications/manifest-provider/bxAppManifest';
import { getApplicationsByManifestURLs, getInstalledManifestURLs } from '../../applications/selectors';
import { ApplicationsImmutable } from '../../applications/types';
import { getFrontActiveTabId } from '../../applications/utils';
import { MARK_AS_DONE } from '../../onboarding/duck';
import { isDone } from '../../onboarding/selectors';
import { closeTab, updateBackForwardState, updateLastActivity, updateTabURL } from '../../tabs/duck';
import { getTabApplicationId, getTabId } from '../../tabs/get';
import { getTabs } from '../../tabs/selectors';
import { StationTabsImmutable } from '../../tabs/types';
import {
  callService,
  createWebContentsServiceObserverChannel,
  takeEveryWitness,
  takeLatestWitness,
  serviceAddObserverChannel,
} from '../../utils/sagas';
import SubWindowManager from '../../windows/utils/SubWindowManager';
import {
  ATTACH_WEBCONTENTS_TO_TAB,
  CHANGE_HASH_AND_NAVIGATE_TO_TAB,
  ChangeHashAndNavigateToTabAction,
  CloseAfterReattachedOrTimeoutAction,
  doAttach,
  domReady,
  DomReadyAction,
  EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB,
  executeWebviewMethod,
  ExecuteWebviewMethodForCurrentTabAction,
  FRONT_ACTIVE_TAB_CHANGE,
  FrontActiveTabChangeAction,
  NAVIGATE_TAB_TO_URL,
  NavigateTabToURLAction,
  NEW_WEBCONTENTS_ATTACHED_TO_TAB,
  newWebcontentsAttachedToTab,
  NewWebcontentsAttachedToTabAction,
  RACE_CLOSE,
  removeWebcontents,
} from '../duck';
import {
  getTabWebcontents,
  getTabWebcontentsByWebContentsId,
  getWebcontentsCrashed,
  getWebcontentsId,
  getWebcontentsIdForTabId,
  getWebcontentsTabId,
} from '../selectors';
import sleepingSagas from './sleeping';
import closeCurrentTabSagas from './close-current-tab';
import ms = require('ms');
import { ContextMenuService } from '../../services/services/menu/interface';
import services from '../../services/servicesManager';

let seenWebcontents = new Set();

function* reloadTabIfCrashed(action: FrontActiveTabChangeAction): SagaIterator {
  const targetWebcontents = yield select(getTabWebcontents);
  const { tabId } = action;

  if (!tabId || !targetWebcontents.get(tabId)) return;
  const twc = targetWebcontents.get(tabId);

  if (getWebcontentsCrashed(twc)) yield put(executeWebviewMethod(tabId, 'reload'));
}

function* interceptPrint({ webcontentsId, tabId }: NewWebcontentsAttachedToTabAction): SagaIterator {
  let waitingForPrint = false;
  const printChannel = createWebContentsServiceObserverChannel(
    webcontentsId, 'addPrintObserver', 'onPrint', 'intercept-print');

  // Listen for print events
  yield takeEveryWitness(printChannel, function* handle() {
    const currentActiveTabId = yield select(getFrontActiveTabId);
    if (currentActiveTabId === tabId) {
      // If print is called on  current active tab, show print modal...
      // delay is a workaround for https://github.com/electron/electron/issues/16792
      yield call(delay, 500);
      yield callService('tabWebContents', 'print', webcontentsId);
    } else {
      // ... else, add it to print queue.
      waitingForPrint = true;
    }
  });

  // Listen for active tab change events
  yield takeLatestWitness(FRONT_ACTIVE_TAB_CHANGE, function* handle(action: FrontActiveTabChangeAction) {
    // When active tab is changed, if the new active tab is in the print queue,
    // trigger the print modal.
    if (waitingForPrint && action.tabId === tabId) {
      waitingForPrint = false;

      const wcId = yield select(getWebcontentsIdForTabId, action.tabId);
      yield callService('tabWebContents', 'print', wcId);
    }
  });
}

function* interceptDestroyedEvents({ webcontentsId, tabId }: NewWebcontentsAttachedToTabAction): SagaIterator {
  const destroyedChannel = createWebContentsServiceObserverChannel(
    webcontentsId, 'addLifeCycleObserver', 'onDestroyed', 'intercept-destroyed');

  yield takeEveryWitness(destroyedChannel, function* () {
    const twc = yield select(getTabWebcontentsByWebContentsId, webcontentsId);
    // only clear tabWebcontents if the tabIb have not been reattached
    if (twc && getWebcontentsTabId(twc) === tabId) {
      yield put(removeWebcontents(tabId));
    }
  });
}

function* interceptCloseEvents({ webcontentsId, tabId }: NewWebcontentsAttachedToTabAction): SagaIterator {
  const nextCloseEvent = createWebContentsServiceObserverChannel(
    webcontentsId, 'addLifeCycleObserver', 'onClose', 'intercept-close');

  while (true) {
    yield take(nextCloseEvent);
    yield put(closeTab(tabId));
  }
}

function* watchForNewWebContents({ tabId, webcontentsId }: NewWebcontentsAttachedToTabAction): SagaIterator {
  if (!seenWebcontents.has(webcontentsId)) {
    yield put(newWebcontentsAttachedToTab(tabId, webcontentsId));
    seenWebcontents = seenWebcontents.add(webcontentsId);
  }
}

function* interceptWebcontentsReady({ webcontentsId, tabId }: DomReadyAction) {
  const domReadyEventChannel = createWebContentsServiceObserverChannel(
    webcontentsId, 'addLifeCycleObserver', 'onDomReady', 'intercept-ready');

  yield takeEveryWitness(domReadyEventChannel, function* handle() {
    yield put(domReady(webcontentsId, tabId));
  });
}

function* interceptNavigateEvents({ webcontentsId, tabId }: NewWebcontentsAttachedToTabAction): SagaIterator {
  const navigationEventChannel = createWebContentsServiceObserverChannel(
    webcontentsId, 'addLifeCycleObserver', 'onNavigate', 'intercept-nav');

  yield takeEveryWitness(navigationEventChannel,
    function* navigationEventChannelCallback({ canGoBack, canGoForward }: { canGoBack: boolean, canGoForward: boolean }) {
      yield put(updateBackForwardState(tabId, canGoBack, canGoForward));
    }
  );
}

function* closeSubwindowIfReattachedOrTimeout({ tabId }: CloseAfterReattachedOrTimeoutAction): SagaIterator {
  yield race({
    reattach: take((action: any) =>
      action.type === ATTACH_WEBCONTENTS_TO_TAB && action.tabId === tabId),
    timeout: call(delay, 5000),
  });

  yield call([SubWindowManager, SubWindowManager.close], tabId);
}

function* getTabsToLoadOnStartup() {
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');

  const manifestURLs = yield select(getInstalledManifestURLs);
  const manifests: Map<string, BxAppManifest> = yield call(getAllManifests, bxApp, manifestURLs);
  const appSettings: ApplicationsSettingsImmutable = yield select(getApplicationsSettings);
  const alwaysLoadedManifests = Array.from(manifests.entries())
    .filter(([manifestURL, manifest]) => isAlwaysLoaded(manifest, appSettings.get(manifestURL)))
    .map(([manifestURL]) => manifestURL);

  const applicationsToLoad: ApplicationsImmutable = yield select(
    getApplicationsByManifestURLs,
    alwaysLoadedManifests
  );
  const applicationIds = applicationsToLoad.map(getApplicationId);

  const tabs: StationTabsImmutable = yield select(getTabs);
  return tabs.filter(tab => {
    const applicationId = getTabApplicationId(tab);
    return applicationIds.includes(applicationId);
  });
}

function* startProgressiveWarmup() {
  const isOnboardingDone = yield select(isDone);

  if (!isOnboardingDone) {
    yield take((action: any) => action.type === MARK_AS_DONE && action.done);
  }

  const tabsToLoad = yield call(getTabsToLoadOnStartup);

  const tabId1 = yield select(getFrontActiveTabId);
  yield put(doAttach(tabId1));

  yield takeEveryWitness(FRONT_ACTIVE_TAB_CHANGE, function* ({ tabId }: FrontActiveTabChangeAction) {
    yield put(doAttach(tabId));
  });

  // wait for the first tab to load correctly
  yield call(delay, ms('15sec'));

  for (const tab of tabsToLoad.values()) {
    yield put(doAttach(getTabId(tab)));
    yield call(delay, ms('4sec'));
  }
}

function* setTabActivityDebounced({ tabId }: FrontActiveTabChangeAction) {
  const now = yield call(Date.now);
  // FRONT_ACTIVE_TAB_CHANGE can be triggered 2 times quickly
  // when switching from tab 1 in app A to tab 2 in app B
  // we debounce and take only last one
  yield call(delay, 100);
  yield put(updateLastActivity(tabId, now));
}

function* pushUrlOnTabWebcontentsThenNavigate({ tabId, url }: ChangeHashAndNavigateToTabAction): SagaIterator {
  const twcs = yield select(getTabWebcontents);
  const twc = twcs.get(tabId);

  if (!twc) {
    // webContents not loaded, so we can just update the tab's URL, then it will load when we'll navigate to it
    yield put(updateTabURL(tabId, url));
  } else {
    // new url differs only from hash

    const code = `
      document.location.href = '${url.replace('\'', '\\\'')}';
    `;
    yield callService('tabWebContents', 'executeJavaScript', getWebcontentsId(twc), code);
  }
  yield put(navigateToApplicationTabAutomatically(tabId));
}

function* loadURLOnTabWebcontents({ tabId, url }: NavigateTabToURLAction): SagaIterator {
  /*
  * When a NavigateTabToURLAction is dispatched, corresponding tab URL should be updated
  * it's necessessary to update URL here because `handleDidNavigate` (in Application.js) does not handle all the cases
  */
  yield put(updateTabURL(tabId, url));
  const twcs = yield select(getTabWebcontents);
  const twc = twcs.get(tabId);
  if (!twc) return;
  try {
    yield callService('tabWebContents', 'loadURL', getWebcontentsId(twc), url);
  } catch (e) {
    console.warn(e);
  }
}

function* sagaExecuteWebviewMethodForCurrentTab({ method }: ExecuteWebviewMethodForCurrentTabAction): SagaIterator {
  const tabId = yield select(getFocusedTabId);
  if (!tabId) return;
  yield put(executeWebviewMethod(tabId, method));
}

function* interceptAutofill({ webcontentsId }: { webcontentsId: number }) {
  const autofillMenu: ContextMenuService = yield callService('contextMenu', 'create', { webcontentsId });
  // const popupChannel = serviceAddObserverChannel(autofillMenu, 'onAskAutofillPopup', 'autofill-popup-asked');
  const clickChannel = serviceAddObserverChannel(autofillMenu, 'onClickItem', 'autofill-popup-value-selected');

  yield takeEveryWitness(clickChannel, function* handle({ action, args }: any) {
    if (args.length > 0) ipcRenderer.sendTo(webcontentsId, action, args[0]);
  });

  // yield takeEveryWitness(popupChannel, function* handle(rect: any) {
  //   const email = yield select(getUserEmail);
  //   if (email) yield autofillMenu.popupAutofill({ emails: [email], rect });
  // });
}

export default function* main() {
  yield all([
    takeEveryWitness(MAIN_APP_READY, startProgressiveWarmup),
    takeEveryWitness(FRONT_ACTIVE_TAB_CHANGE, reloadTabIfCrashed),
    // takeLatestWitness + delay => debounce
    takeLatestWitness(FRONT_ACTIVE_TAB_CHANGE, setTabActivityDebounced),
    takeEveryWitness(ATTACH_WEBCONTENTS_TO_TAB, watchForNewWebContents),
    takeEveryWitness(ATTACH_WEBCONTENTS_TO_TAB, interceptAutofill),
    takeEveryWitness(NEW_WEBCONTENTS_ATTACHED_TO_TAB, interceptCloseEvents),
    takeEveryWitness(NEW_WEBCONTENTS_ATTACHED_TO_TAB, interceptDestroyedEvents),
    takeEveryWitness(NEW_WEBCONTENTS_ATTACHED_TO_TAB, interceptNavigateEvents),
    takeEveryWitness(NEW_WEBCONTENTS_ATTACHED_TO_TAB, interceptWebcontentsReady),
    takeEveryWitness(NEW_WEBCONTENTS_ATTACHED_TO_TAB, interceptPrint),
    takeEveryWitness(NAVIGATE_TAB_TO_URL, loadURLOnTabWebcontents),
    takeEveryWitness(CHANGE_HASH_AND_NAVIGATE_TO_TAB, pushUrlOnTabWebcontentsThenNavigate),
    takeEveryWitness(RACE_CLOSE, closeSubwindowIfReattachedOrTimeout),
    takeEveryWitness(EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB, sagaExecuteWebviewMethodForCurrentTab),
    spawn(sleepingSagas),
    spawn(closeCurrentTabSagas),
  ]);
}
