import { all, spawn } from 'redux-saga/effects';

import appRequest from '../app-request/sagas';

export default function* root() {
  yield all([
    spawn(appRequest),
  ]);
}
