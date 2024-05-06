import * as remote from '@electron/remote';
import { SagaIterator } from 'redux-saga';
import { call, select, put, all, getContext } from 'redux-saga/effects';
import { getTabById, getTabsSortedByLastActivityAt } from '../../tabs/selectors';
import { getTabApplicationId, getTabIsApplicationHome, getTabId, isIgnoredForBackHistory } from '../../tabs/get';
import { getApplicationById, getApplicationsWithoutInternals } from '../../applications/selectors';
import { getApplicationId } from '../../applications/get';
import { CLOSE_CURRENT_TAB, ignoreForBackHistory, closeTab, AfterCloseTabNavigation } from '../../tabs/duck';
import { navigateToApplicationTab } from '../../applications/duck';
import { takeEveryWitness, callService, tryCatch } from '../../utils/sagas';
import { getFocusedTabId } from '../../app/selectors';
import { BrowserXAppWorker } from '../../app-worker';
import { StationTabImmutable } from '../../tabs/types';
import { observe } from '../../utils/sagas/observe';

export function* getTabsAvailableForBackNavigation(): SagaIterator {
  const applicationsIdsWithoutInternals = (yield select(getApplicationsWithoutInternals))
    .toArray()
    .map(getApplicationId);

  return (yield select(getTabsSortedByLastActivityAt))
    .reverse()
    .filter((t: StationTabImmutable) =>
      !isIgnoredForBackHistory(t) &&
      applicationsIdsWithoutInternals.includes(getTabApplicationId(t)));
}

function* closeWindowIfNotMain(): SagaIterator {
  const {
    mainWindowManager,
  }: BrowserXAppWorker = yield getContext('bxApp');

  const mainWindowId = yield call([mainWindowManager, mainWindowManager.window!.getId]);

  // yield callService('browserWindow', 'getFocusedWindow') doesn't work
  // since we don't manage SaaS his own opened windows
  const focusedWindow = yield call([remote.BrowserWindow, remote.BrowserWindow.getFocusedWindow]);
  //vk: const focusedWindow = yield call([remote, remote.BrowserWindow.getFocusedWindow]);

  if (mainWindowId !== focusedWindow.id) {
    yield call([focusedWindow, focusedWindow.close]);
    return true;
  }

  return false;
}

/**
 * We can't close home tabs since it's the entry point for apps.
 * So we mark the tab as ignored for the back history
 * then we have getTabsAvailableForBackNavigation
 * with only navigatable tabs
 */
function* navigateToPreviousTabFromApplicationHome(tab: StationTabImmutable): SagaIterator {
  yield put(ignoreForBackHistory(getTabId(tab)));
  const tabs = yield call(getTabsAvailableForBackNavigation);

  if (tabs.count() > 0) {
    const nextTab = tabs.get(0);

    yield put(navigateToApplicationTab(getTabApplicationId(nextTab), getTabId(nextTab), 'close-tab'));
  }
}

function* closeCurrentTab(via: 'click' | 'keyboard-shortcut'): SagaIterator {
  const {
    manifestProvider,
  }: BrowserXAppWorker = yield getContext('bxApp');

  const windowClosed = yield call(closeWindowIfNotMain);

  if (windowClosed) return;

  const tabId = yield select(getFocusedTabId);
  const tab = yield select(getTabById, tabId);

  if (!tab) return;

  const applicationId = getTabApplicationId(tab);
  const application = yield select(getApplicationById, applicationId);

  if (!application) return;

  if (getTabIsApplicationHome(tab)) {
    yield call(navigateToPreviousTabFromApplicationHome, tab);
  } else {
    yield put(closeTab(tabId, AfterCloseTabNavigation.PreviousFocusedPage));
  }
}

function* onTabsChange(): SagaIterator {
  const tabsAvailableForBackNavigation = yield call(getTabsAvailableForBackNavigation);

  yield callService('menu', 'setEnabled', {
    menuItemId: 'close-current-tab',
    value: tabsAvailableForBackNavigation.count() > 0,
  });
}

export default function* main() {
  yield all([
    takeEveryWitness(CLOSE_CURRENT_TAB, closeCurrentTab),
    observe(getTabsSortedByLastActivityAt, tryCatch(onTabsChange)),
  ]);
}
