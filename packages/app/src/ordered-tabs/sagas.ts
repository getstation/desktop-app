import { SagaIterator } from 'redux-saga';
import { all, put } from 'redux-saga/effects';

import { takeEveryWitness } from '../utils/sagas';

import {
  addTabAction,
  removeTabAction,
  ADD as ADD_TAB,
  REMOVE as REMOVE_TAB,
} from '../tabs/duck';

import {
  removeTab as removeOrderedTab,
  pushTab as pushOrderedTab,
} from './duck';

function* sagaHandleAddTab(action: addTabAction): SagaIterator {
  const { tabId, applicationId, isApplicationHome } = action;
  if (isApplicationHome || !tabId) return;

  yield put(pushOrderedTab(applicationId, tabId));
}

function* sagaHandleRemoveTab(action: removeTabAction): SagaIterator {
  const { applicationId, tabId } = action;
  if (!tabId || !applicationId) return;

  yield put(removeOrderedTab(applicationId, tabId));
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(ADD_TAB, sagaHandleAddTab),
    takeEveryWitness(REMOVE_TAB, sagaHandleRemoveTab),
  ]);
}
