import { all, call, put, select, delay } from 'redux-saga/effects';
import {
  ACTIVATE_FOR_CURRENT_TAB,
  FIND_NEXT_IN_TAB,
  resetSearchResultsForTab,
  SET_ACTIVE_FOR_TAB,
  SET_SEARCH_STRING_FOR_TAB,
  setActiveFocusForTab,
  setActiveForTab,
  setSearchResultsForTab,
  STOP_FIND_IN_TAB,
  stopFindInTab,
} from './duck';
import { getSearchStringForTab } from './selectors';
import {
  getTabWebcontentsById,
  getWebcontentsId,
  getWebcontentsIdForTabId,
  getWebcontentsMountedAt
} from '../tab-webcontents/selectors';
import { getFrontActiveTabId } from '../applications/utils';
import { callService, takeEveryWitness, throttleWitness } from '../utils/sagas';
import { isVisible as isAppStoreVisible } from '../app-store/selectors';

/**
 * Hack:
 * We have a weird behaviour that we haven't successfully reproduced in fiddle yet.
 * When we trigger a findInPage quickly after webContents have been created,
 * the app can freeze, and we have no reproduction steps in Fiddle yet.
 * @see https://github.com/electron/electron/issues/20602
 * We wait for `waitMsBeforeFindInPage` ms after the webContents has been attached before triggering the search
 */
function* waitBeforeCallingFindInPage(mountedAt) {
  const waitMsBeforeFindInPage = 2500;
  const diff = Date.now() - mountedAt;
  if (diff < waitMsBeforeFindInPage) {
    yield delay(waitMsBeforeFindInPage - diff);
  }
}

function* findInPage({ tabId }) {
  const searchString = yield select(getSearchStringForTab, tabId);

  const webcontents = yield select(getTabWebcontentsById, tabId);
  if (!webcontents) return;

  const webcontentsId = getWebcontentsId(webcontents);
  if (searchString.length === 0) {
    yield put(stopFindInTab(tabId));
  } else {
    yield call(waitBeforeCallingFindInPage, getWebcontentsMountedAt(webcontents) || Date.now());
    const searchResult = yield callService('tabWebContents', 'findInPage', webcontentsId, searchString);
    if (!searchResult) return;
    const { requestId, activeMatchOrdinal, matches: matchesCount } = searchResult;
    yield put(setSearchResultsForTab(tabId, requestId, activeMatchOrdinal, matchesCount));
  }
}
function* findNextInPage({ tabId }) {
  const searchString = yield select(getSearchStringForTab, tabId);
  if (searchString.length === 0) return;

  const webcontents = yield select(getTabWebcontentsById, tabId);
  if (!webcontents) return;

  const webcontentsId = getWebcontentsId(webcontents);

  yield call(waitBeforeCallingFindInPage, getWebcontentsMountedAt(webcontents) || Date.now());
  const searchResult = yield callService('tabWebContents', 'findInPage', webcontentsId, searchString, {
    findNext: true
  });
  if (!searchResult) return;
  const { requestId, activeMatchOrdinal, matches: matchesCount } = searchResult;
  yield put(setSearchResultsForTab(tabId, requestId, activeMatchOrdinal, matchesCount));
}

function* stopFindInPage({ tabId }) {
  const webcontentsId = yield select(getWebcontentsIdForTabId, tabId);
  yield callService('tabWebContents', 'stopFindInPage', webcontentsId);
  yield put(resetSearchResultsForTab(tabId));
}

function* activateForCurrentTab() {
  // if app store is shown do not show the search in tab
  if (yield select(isAppStoreVisible)) return;

  const tabId = yield select(getFrontActiveTabId);
  if (!tabId) return;
  yield put(setActiveForTab(tabId));
  yield put(setActiveFocusForTab(tabId));
}

function* watchActive({ tabId, active }) {
  if (active === false) {
    yield put(stopFindInTab(tabId));
  }
}

export default function* main() {
  yield all([
    throttleWitness(150, SET_SEARCH_STRING_FOR_TAB, findInPage),
    throttleWitness(150, FIND_NEXT_IN_TAB, findNextInPage),
    takeEveryWitness(STOP_FIND_IN_TAB, stopFindInPage),
    takeEveryWitness(SET_ACTIVE_FOR_TAB, watchActive),
    takeEveryWitness(ACTIVATE_FOR_CURRENT_TAB, activateForCurrentTab)
  ]);
}
