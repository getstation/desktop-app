import { SagaIterator } from 'redux-saga';
import { all, call, delay, put, select } from 'redux-saga/effects';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import { navigateToApplicationTab, setActiveTab, setHomeTabAsActive } from '../applications/duck';
import { getApplicationActiveTab, getApplicationId } from '../applications/get';
import {
  getApplicationById,
  getFirstApplicationWithAttachedActiveTab,
  getHomeTab,
} from '../applications/selectors';
import { getFrontActiveTabId } from '../applications/utils';
import { changeSelectedAppMain } from '../nav/duck';
import { getPreviousActiveApplicationId } from '../nav/selectors';
import { ATTACH, DETACH, DetachAction } from '../subwindows/duck';
import { setDetaching } from '../tab-webcontents/duck';
import { getTabsAvailableForBackNavigation } from '../tab-webcontents/sagas/close-current-tab';
import { takeEveryWitness } from '../utils/sagas';
import {
  ADD,
  addTabAction,
  CLOSE,
  CLOSE_ALL_IN_APP,
  closeAllTabsInAppAction,
  closeTabAction,
  removeTab,
  AfterCloseTabNavigation,
} from './duck';
import { getTabApplicationId, getTabId, getTabIsApplicationHome } from './get';
import { getTabById, getTabsForApplication } from './selectors';

function* doCloseTab(
  { tabId, navigation }: closeTabAction
): SagaIterator {
  const tab = yield select(getTabById, tabId);
  if (!tab) return;

  const applicationId = getTabApplicationId(tab);
  const application = yield select(getApplicationById, applicationId);

  if (!application) return;

  const applicationActiveTabId = getApplicationActiveTab(application);
  const applicationHomeTab = yield select(getHomeTab, applicationId);

  if (!getTabIsApplicationHome(tab)) {
    // Remove tab if not home
    yield put(removeTab(applicationId, tabId));
  }

  switch (navigation) {
    case AfterCloseTabNavigation.Default: {
      const activeTabId = yield select(getFrontActiveTabId);
      if (activeTabId === tabId) {
        // Navigate to home tab if we close the tab we were currently on
        yield put(setHomeTabAsActive(applicationId));
      } else if (applicationActiveTabId === tabId && applicationHomeTab) {
        // If we closed activeTab of an app, set activeTab to this app's home
        yield put(setActiveTab(applicationId, getTabId(applicationHomeTab)));
      }
      break;
    }
    case AfterCloseTabNavigation.PreviousFocusedPage: {
      const tabs = yield call(getTabsAvailableForBackNavigation);

      if (tabs.count() > 0) {
        const nextTab = tabs.get(0);

        yield put(navigateToApplicationTab(getTabApplicationId(nextTab), getTabId(nextTab), 'close-tab'));
        yield put(setActiveTab(applicationId, getTabId(applicationHomeTab)));
      }
      break;
    }
  }
}

function* animateApplicationIcon({ applicationId }: addTabAction): SagaIterator {
  yield put(updateUI('applicationTabAdded', applicationId, true));
  yield delay(1000);
  yield put(updateUI('applicationTabAdded', applicationId, false));
}

function* removeAllTabs({ applicationId }: closeAllTabsInAppAction): SagaIterator {
  const applicationTabs = (yield select(getTabsForApplication, applicationId)).values();

  for (const tab of applicationTabs) {
    const tabId = getTabId(tab);
    yield put(removeTab(applicationId, tabId));
  }
}

function* handleDetachTab({ tabId }: DetachAction): SagaIterator {
  yield put(setDetaching(tabId));

  const tab = yield select(getTabById, tabId);
  const isHome = getTabIsApplicationHome(tab);

  if (isHome) {
    const previousActiveAppId = yield select(getPreviousActiveApplicationId);
    if (previousActiveAppId) {
      yield put(changeSelectedAppMain(previousActiveAppId));
    } else {
      const application = yield select(getFirstApplicationWithAttachedActiveTab);
      if (application) {
        yield put(changeSelectedAppMain(getApplicationId(application)));
      } // else:
      // either all installed applications have active tab detached,
      // or there is no other installed application. So nothing we can do
    }
  } else {
    const applicationId = getTabApplicationId(tab);
    yield put(setHomeTabAsActive(applicationId));
  }
}

function* handleAttachTab({ tabId }: DetachAction): SagaIterator {
  const tab = yield select(getTabById, tabId);
  const applicationId = getTabApplicationId(tab);

  yield put(navigateToApplicationTab(applicationId, tabId));
}

export default function* main() {
  yield all([
    takeEveryWitness(CLOSE, doCloseTab),
    takeEveryWitness(ADD, animateApplicationIcon),
    takeEveryWitness(CLOSE_ALL_IN_APP, removeAllTabs),
    takeEveryWitness(DETACH, handleDetachTab),
    takeEveryWitness(ATTACH, handleAttachTab),
  ]);
}
