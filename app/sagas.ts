/* eslint-disable global-require */
import { all, call, spawn } from 'redux-saga/effects';

function createAsyncImport(...args: any[]) {
  return function* asyncImport(importPromise: Promise<any>) {
    const w = yield call(() => importPromise.then(y => y.default || y));
    yield (call as any)(w, ...args);
  };
}

export default function* root(bxApp: any) {
  yield all([
    spawn(createAsyncImport(bxApp), import('./activity/sagas')),
    spawn(createAsyncImport(bxApp), import('./bang/sagas')),
    spawn(createAsyncImport(bxApp), import('./history/sagas')),
    spawn(createAsyncImport(bxApp), import('./dl-toaster/sagas')),
    spawn(createAsyncImport(bxApp), import('./downloads/sagas')),
    spawn(createAsyncImport(bxApp), import('./app/sagas')),
    spawn(createAsyncImport(bxApp), import('./ordered-favorites/sagas')),
    spawn(createAsyncImport(bxApp), import('./favorites/sagas')),
    spawn(createAsyncImport(bxApp), import('./applications/sagas')),
    spawn(createAsyncImport(bxApp), import('./tab-webcontents/sagas')),
    spawn(createAsyncImport(bxApp), import('./in-tab-search/sagas')),
    spawn(createAsyncImport(bxApp), import('./auto-update/sagas')),
    spawn(createAsyncImport(bxApp), import('./ordered-tabs/sagas')),
    spawn(createAsyncImport(bxApp), import('./tabs/sagas')),
    spawn(createAsyncImport(bxApp), import('./subwindows/sagas')),
    spawn(createAsyncImport(bxApp), import('./dialogs/sagas')),
    spawn(createAsyncImport(bxApp), import('./notification-center/sagas')),
    spawn(createAsyncImport(bxApp), import('./user-identities/sagas')),
    spawn(createAsyncImport(bxApp), import('./onboarding/sagas')),
    spawn(createAsyncImport(bxApp), import('./theme/sagas')),
    spawn(createAsyncImport(bxApp), import('./settings/applications/sagas')),
    spawn(createAsyncImport(bxApp), import('./app-store/sagas')),
    spawn(createAsyncImport(bxApp), import('./ui/sagas')),
    spawn(createAsyncImport(bxApp), import('./user-activities/sagas')),
    spawn(createAsyncImport(bxApp), import('./password-managers/sagas')),
    spawn(createAsyncImport(bxApp), import('./plugins/sagas')),
    spawn(createAsyncImport(bxApp), import('./application-settings/sagas')),
    spawn(createAsyncImport(bxApp), import('./urlrouter/sagas')),
    spawn(createAsyncImport(bxApp), import('./chrome-extensions/sagas')),
    spawn(createAsyncImport(bxApp), import('./abstract-application/sagas')),
  ]);
}
