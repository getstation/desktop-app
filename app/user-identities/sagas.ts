import * as log from 'electron-log';
import { delay, SagaIterator } from 'redux-saga';
import { all, call, put, race, take } from 'redux-saga/effects';
import { installApplication, InstallApplicationReturn } from '../applications/sagas/lifecycle';
import { takeEveryWitness } from '../utils/sagas';
import { GoogleSigninError, signInWithGoogle } from './api';
import {
  CREATE,
  createIdentity,
  REQUEST_SIGNIN_THEN_ADD_APPLICATION,
  requestSignIn,
  RequestSignInAction,
  RequestSignInThenAddAppAction,
  SIGNIN_ERROR,
  SIGNIN_REQUESTED,
  signinError,
} from './duck';
import { AuthProviders } from './types';
import { changeSelectedApp } from '../applications/duck';

function* signinAndAddIdentity(action: RequestSignInAction): SagaIterator {
  log.info('Starting Google signin process');

  const scopes: string[] = action.options.scopes;
  try {
    const signinResult = yield call(signInWithGoogle, scopes);
    yield put(createIdentity(signinResult));
  } catch (err) {
    yield put(signinError(JSON.stringify(err.originalError)));
    // filter errors
    if (!(err instanceof GoogleSigninError)) throw err;

    if (err.message === 'User closed the window') {
      // it's ok..
      log.warn('Google Signin: user closed the window');
    } else {
      log.error('Error during Google Signin', err, err.originalError);
    }
    return;
  }

  log.info('Finished Google signin process');
}

function* signinThenInstallApplication(action: RequestSignInThenAddAppAction): SagaIterator {
  yield put(requestSignIn(action.provider, action.options));
  const { success } = yield race({
    success: take((subaction: any) =>
      subaction.type === CREATE && subaction.provider === action.provider),
    error: take(SIGNIN_ERROR),
    timeout: call(delay, 120000), // 2 minutes
  });

  if (success) {
    const identityJs = {
      ...success,
    };
    identityJs.email = success.profileData.email;
    const createIdentityAction = createIdentity(identityJs);
    yield put(createIdentityAction);
    const { applicationId }: InstallApplicationReturn = yield call(
      installApplication, action.manifestURL,
      { identityId: createIdentityAction.identityId }
    );
    yield put(changeSelectedApp(applicationId, 'app-installation'));
  }
}

export function* callRequestSignIn(provider: AuthProviders): SagaIterator {
  yield put(requestSignIn(provider));
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(SIGNIN_REQUESTED, signinAndAddIdentity),
    takeEveryWitness(REQUEST_SIGNIN_THEN_ADD_APPLICATION, signinThenInstallApplication),
  ]);
}
