import { all, call, select } from 'redux-saga/effects';
import { REMOVE, removeTabAction } from '../tabs/duck';
import { takeEveryWitness } from '../utils/sagas';
import SubWindowManager from '../windows/utils/SubWindowManager';
import { hasSubwindow } from './selectors';

function* closeSubwindowOnTabRemoved(action: removeTabAction) {
  const { tabId } = action;
  const detached = yield select(hasSubwindow, tabId);
  if (detached) {
    yield call([SubWindowManager, SubWindowManager.close], tabId);
  }
}

export default function* main() {
  yield all([
    takeEveryWitness(REMOVE, closeSubwindowOnTabRemoved),
  ]);
}
