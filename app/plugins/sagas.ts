import bxsdk from '@getstation/sdk';
import { SagaIterator } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
import { Observable } from 'rxjs/Rx';
import { BrowserXAppWorker } from '../app-worker';
import { getManifestOrTimeout } from '../applications/api';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import bxSDK from '../sdk';
import { handleError } from '../services/api/helpers';
import { takeEveryWitness } from '../utils/sagas';
import { getProvider } from './';
import { getServiceRuntime, ServiceRuntime } from './api';
import { ACTIVATE_SERVICE, ActivateServiceAction, activateServiceRenderer } from './duck';
import DeprecatedSDKProvider from './SDKProvider';

function* handleActivateServiceAction(bxApp: BrowserXAppWorker, action: ActivateServiceAction): SagaIterator {
  const { manifestURL } = action;

  const manifest: BxAppManifest = yield call(getManifestOrTimeout, bxApp, manifestURL);
  const runtime: ServiceRuntime | undefined = yield call(getServiceRuntime, manifest);

  if (runtime) {
    const sdk = bxsdk(
      {
        id: manifestURL,
        name: manifestURL,
      },
      bxSDK
    );

    // FIXME legacy
    yield put(activateServiceRenderer(manifestURL, manifest.bx_legacy_service_id!));

    const provider: DeprecatedSDKProvider = yield call(getProvider);
    const serviceErrors$: Observable<Error> = yield call(runtime.activate, sdk, provider.consumer);
    serviceErrors$.subscribe(handleError());
  }
}

export default function* main(bxApp: BrowserXAppWorker): SagaIterator {
  yield all([
    takeEveryWitness(ACTIVATE_SERVICE, handleActivateServiceAction, bxApp),
  ]);
}
