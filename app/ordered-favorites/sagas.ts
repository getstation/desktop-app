import { SagaIterator } from 'redux-saga';
import { all, put, select } from 'redux-saga/effects';
import { getFavoriteIdByTabId } from '../favorites/selectors';
import { getTabApplicationId } from '../tabs/get';
import { getTabById } from '../tabs/selectors';
import { StationTabImmutable } from '../tabs/types';

import { takeEveryWitness } from '../utils/sagas';
import { CLOSE as CLOSE_TAB, closeTabAction } from '../tabs/duck';

import {
  AddFavoriteAction,
  DeleteFavoriteAction,
  ADD as ADD_FAVORITE,
  DELETE as DELETE_FAVORITE,
} from '../favorites/duck';

import {
  removeFavorite as removeOrderedFavorite,
  pushFavorite as pushOrderedFavorite,
} from './duck';
import { getApplicationIdByFavoriteId } from './selectors';

function* sagaHandleAddFavorite(action: AddFavoriteAction): SagaIterator {
  const { applicationId, favoriteId } = action;
  if (!favoriteId) return;

  yield put(pushOrderedFavorite(applicationId, favoriteId));
}

function* sagaHandleDeleteFavorite(action: DeleteFavoriteAction): SagaIterator {
  const { favoriteId } = action;

  const applicationId: string | null = yield select(getApplicationIdByFavoriteId, favoriteId);

  if (applicationId && favoriteId) {
    yield put(removeOrderedFavorite(applicationId, favoriteId));
  }
}

function* sagaHandleCloseTab(action: closeTabAction): SagaIterator {
  const { tabId } = action;

  const tab: StationTabImmutable = yield select(getTabById, tabId);

  const applicationId = getTabApplicationId(tab);
  const favoriteId: string | undefined = yield select(getFavoriteIdByTabId, tabId);

  if (applicationId && favoriteId) {
    yield put(removeOrderedFavorite(applicationId, favoriteId));
  }
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(ADD_FAVORITE, sagaHandleAddFavorite),
    takeEveryWitness(DELETE_FAVORITE, sagaHandleDeleteFavorite),
    takeEveryWitness(CLOSE_TAB, sagaHandleCloseTab),
  ]);
}
