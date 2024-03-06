import { SagaIterator } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';

import { takeEveryWitness } from '../../utils/sagas';
import {
  OPEN_APPLICATION_PREFERENCES,
  OpenApplicationPreferencesAction,
} from './duck';

function* openApplicationPreferences(
  { manifestURL }: OpenApplicationPreferencesAction
): SagaIterator {
  yield put(updateUI('settings', 'selectedManifestURL', manifestURL));
  yield put(updateUI('settings', 'activeTabTitle', 'My Apps'));
  yield put(updateUI('settings', 'isVisible', true));
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(OPEN_APPLICATION_PREFERENCES, openApplicationPreferences),
  ]);
}
