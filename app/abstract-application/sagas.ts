import { SagaIterator } from 'redux-saga';
import { all, call, select } from 'redux-saga/effects';
import { deleteManifest } from '../../manifests/private';

import { takeEveryWitness } from '../utils/sagas';

import {
  getApplicationsByManifestURL,
} from '../applications/selectors';
import { uninstallApplication } from '../applications/sagas/lifecycle';
import { getApplicationId } from '../applications/get';
import {
  UNINSTALL_ALL_INSTANCES,
  UninstallAllInstancesAction,
} from './duck';

export function* uninstallAllInstances(
  { manifestURL }: UninstallAllInstancesAction
): SagaIterator {
  const instances = yield select(getApplicationsByManifestURL, manifestURL);

  for (const instance of instances.valueSeq()) {
    yield call(uninstallApplication, getApplicationId(instance));
  }

  // delete private manifest if it's a custom app
  const match = manifestURL.match(/^station-manifest:\/\/(\d+)$/);
  if (match) {
    const manifestId = Number(match[1]);
    if (manifestId > 1000000) {
      yield call(deleteManifest, Number(match[1]));
    }
  }
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(UNINSTALL_ALL_INSTANCES, uninstallAllInstances),
  ]);
}
