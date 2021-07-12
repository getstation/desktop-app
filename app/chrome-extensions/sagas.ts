import { equals } from 'ramda';
import { SagaIterator } from 'redux-saga';
import { all, call, fork, put, select, getContext } from 'redux-saga/effects';
import { handleError } from '../services/api/helpers';
import services from '../services/servicesManager';
import { callService, serviceAddObserverChannel, takeEveryWitness } from '../utils/sagas';
import {
  CHECK_FOR_UPDATE,
  CheckForUpdateAction,
  extensionUpdateIsAvailable,
  removeFromChecking,
  removeFromLoaded,
  setAsLoaded,
} from './duck';
import { Extension } from './types';
import { getImportedCXIdsForManifests } from './api';
import { getLoadedExtensionIds } from './selectors';
import { SetActiveTabAction, SET_ACTIVE_TAB } from '../applications/duck';
import { getInstalledManifestURLs } from '../applications/selectors';
import { getWebcontentsIdForTabId } from '../tab-webcontents/selectors';
import { observe } from '../utils/sagas/observe';
import { BrowserXAppWorker } from '../app-worker';

/**
 * Will observe the state changes of installed applications and load/unload extensions.
 * We compare the state of installed applications with the state of loaded extensions.
 */
function* watchInstalledManifests() {
  yield observe(
    getInstalledManifestURLs,
    function* (installedManifestsURLs: string[], previousInstalledManifestsURLs: string[]): SagaIterator {
      if (equals(installedManifestsURLs, previousInstalledManifestsURLs)) {
        return;
      }

      const bxApp: BrowserXAppWorker = yield getContext('bxApp');

      const extensionIds: string[] = yield call(getImportedCXIdsForManifests, bxApp, installedManifestsURLs);
      const loadedExtensionIds: string[] = yield select(getLoadedExtensionIds);

      // load the extensions that do not appear as loaded
      for (const cxId of extensionIds) {
        if (!loadedExtensionIds.includes(cxId)) {
          try {
            yield call(loadSync, cxId);
          } catch (e) {
            handleError()(e);
          }
        }
      }

      // unload the loaded extensions that should not be
      for (const cxId of loadedExtensionIds) {
        if (!(extensionIds.includes(cxId))) {
          yield call(unloadSync, cxId);
        }
      }
    }
  );
}

function* unloadSync(id: Extension['id']): SagaIterator {
  yield callService('ecx', 'unloadExtension', id);
  yield put.resolve(removeFromLoaded(id));
}

function* loadSync(id: Extension['id']): SagaIterator {
  const loadedExtension = yield callService('ecx', 'loadExtension', id);
  return yield put.resolve(setAsLoaded(loadedExtension));
}

function* checkForUpdate(
  { extension: { id } }: CheckForUpdateAction
): SagaIterator {
  const extension: Extension = yield callService('ecx', 'getExtension', id);
  const isUp: boolean = yield callService('ecx', 'isUpToDate', id);

  if (!isUp) {
    yield put(extensionUpdateIsAvailable(extension));
  }

  yield put(removeFromChecking(id));
}

function* onExtensionUpdated(extension: Extension): SagaIterator {
  yield put(extensionUpdateIsAvailable(extension));
}

export function* onFocusTab({ tabId }: SetActiveTabAction) {
  const webContentsId = yield select(getWebcontentsIdForTabId, tabId);
  yield callService('ecx', 'dispatchEvent', {
    channel: 'tabs.onActivated',
    payload: [{ tabId: webContentsId, windowId: 1 }],
  });
}

export default function* main() {
  yield all([
    fork(watchInstalledManifests),
    takeEveryWitness(CHECK_FOR_UPDATE, checkForUpdate),
    takeEveryWitness(SET_ACTIVE_TAB, onFocusTab),
    takeEveryWitness(serviceAddObserverChannel(services.ecx, 'onExtensionUpdated', 'ecx-updated'), onExtensionUpdated),
  ]);
}
