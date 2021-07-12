import log from 'electron-log';
import { all, call, fork, put, select } from 'redux-saga/effects';
// @ts-ignore - no typing for redux-ui
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import { READY } from '../app/duck';
import services from '../services/servicesManager';
import { dispatchUrlSaga } from '../urlrouter/sagas';
import { consumeLockFileIfExists, createLockFile, FILE } from '../utils/AppData';
import { callService, periodicTick, serviceAddObserverChannel, takeEveryWitness } from '../utils/sagas';
import {
  CHECK_FOR_UPDATES,
  OPEN_RELEASE_NOTES,
  QUIT_AND_INSTALL,
  SET_UPDATE_IS_AVAILABLE,
  setCheckingForUpdate,
  setDownloadingUpdate,
  setUpdateIsAvailable,
  toggleReleaseNotesSubdockVisibility,
} from './duck';
import { isDownloadingUpdate, isUpdateAvailable } from './selectors';
import ms = require('ms');
import { BrowserXAppWorker } from '../app-worker';

const POLL_UPDATE_INTERVAL = ms('30mins');

function* onQuitAndInstall() {
  services.electronApp.quit();
}

function* initAppUpdater() {
  const updateDownloadedChannel = serviceAddObserverChannel(services.autoUpdater, 'onUpdateDownloaded', 'au-update-downloaded');
  const checkingForUpdateChannel = serviceAddObserverChannel(services.autoUpdater, 'onCheckingForUpdate', 'au-checking-update');
  const updateNotAvailableChannel = serviceAddObserverChannel(services.autoUpdater, 'onUpdateNotAvailable', 'au-update-not-available');
  const updateAvailableChannel = serviceAddObserverChannel(services.autoUpdater, 'onUpdateAvailable', 'au-update-available');
  const errorChannel = serviceAddObserverChannel(services.autoUpdater, 'onError', 'aus-error');

  const fileExists = yield call(consumeLockFileIfExists, FILE.SHOW_RELEASE_NOTES);

  if (fileExists) {
    yield put(toggleReleaseNotesSubdockVisibility());
    yield put(updateUI('autoUpdate', 'visible', true));
  }

  yield fork(function* () {
    yield all([
      takeEveryWitness(updateDownloadedChannel, function* handle({ releaseName }: { releaseName: string }) {
        yield put(setCheckingForUpdate(false));
        yield put(setDownloadingUpdate(false));
        yield put(setUpdateIsAvailable(releaseName));
      }),
      takeEveryWitness(checkingForUpdateChannel, function* handle() {
        yield put(setCheckingForUpdate(true));
      }),
      takeEveryWitness(updateNotAvailableChannel, function* handle() {
        yield put(setCheckingForUpdate(false));
        yield put(setDownloadingUpdate(false));
      }),
      takeEveryWitness(updateAvailableChannel, function* handle() {
        yield put(setDownloadingUpdate(true));
      }),
      takeEveryWitness(errorChannel, function* handle({ message }: { message: string }) {
        log.error(new Error(message));
        yield put(setCheckingForUpdate(false));
        yield put(setDownloadingUpdate(false));
      }),
    ]);
  });
}

function* checkForUpdates() {
  const downloading = yield select(isDownloadingUpdate);
  const updateAvailable = yield select(isUpdateAvailable);

  if (downloading || updateAvailable) {
    log.info('[updater] Skipping check');
    return;
  }

  yield callService('autoUpdater', 'checkForUpdates');
}

function* doOpenReleaseNotes() {
  yield call(dispatchUrlSaga, { url: 'https://feedback.getstation.com/changelog' });
}

function* consumeUpdateLockFile() {
  yield call(createLockFile, FILE.SHOW_RELEASE_NOTES);
}

export default function* main() {
  yield all([
    takeEveryWitness(READY, initAppUpdater),
    takeEveryWitness(QUIT_AND_INSTALL, onQuitAndInstall),
    takeEveryWitness(CHECK_FOR_UPDATES, checkForUpdates),
    takeEveryWitness(OPEN_RELEASE_NOTES, doOpenReleaseNotes),
    takeEveryWitness(SET_UPDATE_IS_AVAILABLE, consumeUpdateLockFile),
  ].concat(process.env.STATION_NO_CHECK_FOR_UPDATE ? [] :
    [takeEveryWitness(periodicTick(POLL_UPDATE_INTERVAL), checkForUpdates)]));
}
