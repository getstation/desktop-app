import { SagaIterator } from 'redux-saga';
import { all, delay, fork, put, putResolve, select, take } from 'redux-saga/effects';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import { setLoadingScreenVisibility, setShowLogin } from '../../app/duck';
import { getShowLogin } from '../../app/selectors';
import { changeSelectedApp } from '../../applications/duck';
import { getFirstApplicationIdInDock } from '../../dock/selectors';
import { OnboardingType } from '../../ui/types';
import { APP_STORE_STEP_FINISHED, markOnboardingAsDone } from '../duck';
import ms = require('ms');

function* doOnboardingIfNecessary() {
  const isOnboarded: boolean = yield select(getShowLogin);
  if (!isOnboarded) return;

  yield put(updateUI('onboarding', 'step', 0));
  yield put(updateUI('onboarding', 'onboardingType', OnboardingType.Regular));

  // Wait for app store step to be finished before continuing
  yield take(APP_STORE_STEP_FINISHED);
  yield put(setShowLogin(false));

  yield put(setLoadingScreenVisibility(true));

  // let's navigate to the first application of the dock
  const applicationId: string = yield select(getFirstApplicationIdInDock);
  yield putResolve(changeSelectedApp(applicationId, 'app-installation'));

  yield delay(ms('3sec'));
  yield put(setLoadingScreenVisibility(false));

  yield put(markOnboardingAsDone());
}

export default function* main(): SagaIterator {
  yield all([
    fork(doOnboardingIfNecessary),
  ]);
}
