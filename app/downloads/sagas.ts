//import { remote } from 'electron';
import { shell as remoteShell } from '@electron/remote';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select } from 'redux-saga/effects';
import { SET_DOWNLOAD_FOLDER, setDefaultDownloadFolder, setDownloadFolder } from '../app/duck';
import { getDownloadFolder } from '../app/selectors';
import { observer } from '../services/lib/helpers';
import { RPC } from '../services/lib/types';
import { DownloadDoneState, DownloadItemService, DownloadUpdatedStatePayload } from '../services/services/download/interface';
import { ElectronAppPath } from '../services/services/electron-app/types';
import services from '../services/servicesManager';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { getTabWebcontentsByWebContentsId } from '../tab-webcontents/selectors';
import { getTabById } from '../tabs/selectors';
import { callService, serviceAddObserverChannel, takeEveryWitness, takeLatestWitness } from '../utils/sagas';
import {
  addItem,
  DOWNLOAD_FOLDER_BROWSE_CLICK,
  NEW_ITEM,
  newItem,
  REVEAL_PATH_IN_FINDER,
  revealPathInFinderAction,
  updateItemProgress,
  updateItemPath,
} from './duck';

// temporay type definitions
interface NewItemAction {
  downloadId: string;
  filePath: string;
  webContentsId: number;
}

interface SetDownloadFolderAction {
  downloadFolder: string;
}

/**
 * The goal of this saga is to handle all NEW_ITEM action,
 * get the current tab to access to his applicationId,
 * then dispatch a ADD_ITEM action.
 *
 * @param {NewItemAction} action a redux action
 * @returns {SagaIterator}
 */
function* addDownloadItemSaga({ downloadId, filePath, webContentsId }: NewItemAction): SagaIterator {
  const twc = yield select(getTabWebcontentsByWebContentsId, webContentsId);

  let applicationId = undefined;
  if (twc) {
    const tab = yield select(getTabById, twc.get('tabId'));
    if (tab) {
      applicationId = tab.get('applicationId');
    }
  }
  yield put(addItem(downloadId, filePath, applicationId));
}

/**
 * This saga is ran when store is loaded.
 * If user has no download folder set, use the current default system download folder provided by electron
 *
 * @returns {SagaIterator}
 */
function* initDefaultDownloadFolderSaga(): SagaIterator {
  const userDownloadFolder: string | undefined = yield select(getDownloadFolder);
  const downloadsPath = yield call(services.electronApp.getPath, ElectronAppPath.Downloads);

  yield put(setDefaultDownloadFolder(downloadsPath));
  if (userDownloadFolder) {
    yield put(setDownloadFolder(userDownloadFolder));
  }
}

function* handleSetDownloadFolder({ downloadFolder }: SetDownloadFolderAction) {
  yield callService('download', 'applyDownloadFolder', downloadFolder);
}

/**
 * This saga handle download state.
 *
 * @param {string} downloadId
 * @param {RPC.Node<DownloadItemService>} downloadItemService
 * @returns
 */
function handleDownloadStateSaga(downloadId: string, downloadItemService: RPC.Node<DownloadItemService>) {
  return function* ({ state }: DownloadUpdatedStatePayload): SagaIterator {
    const savePath = yield call([downloadItemService, downloadItemService.getSavePath]);
    yield put(updateItemPath(downloadId, savePath));
    if (state === 'progressing') {
      const receivedBytes = yield call([downloadItemService, downloadItemService.getReceivedBytes]);
      const totalBytes = yield call([downloadItemService, downloadItemService.getTotalBytes]);
      const progressRate: number = receivedBytes / totalBytes;
      yield put(updateItemProgress(downloadId, state, { progressRate }));
    }
  };
}

/**
 * One call to this saga represent one download.
 *
 * @param {Channel<RPC.Node<DownloadItemService>} downloadItemService
 * @returns {SagaIterator}
 */
function* handleDownloadSaga(downloadItemService: RPC.Node<DownloadItemService>): SagaIterator {
  const savePath: string = yield call([downloadItemService, downloadItemService.getSavePath]);
  const downloadId: string = yield call([downloadItemService, downloadItemService.getDownloadId]);
  const webContentsId: number = yield call([downloadItemService, downloadItemService.getWebContentsId]);

  const itemStateChannel = serviceAddObserverChannel(downloadItemService, 'onUpdated', 'download-updated');

  yield put(newItem(downloadId, savePath, webContentsId));

  yield takeLatestWitness(itemStateChannel, handleDownloadStateSaga(downloadId, downloadItemService));
  const doneState: DownloadDoneState = yield call([downloadItemService, downloadItemService.whenDone]);

  const endedAt = yield call(Date.now);
  yield put(
    updateItemProgress(downloadId, doneState, {
      endedAt, progressRate: 1,
    })
  );
}

function* handleChangeDownloadFolderSaga(): SagaIterator {
  const defaultPath: string = yield select(getDownloadFolder);
  const chosenPath = yield callService('download', 'selectDownloadFolder', defaultPath);

  if (chosenPath !== defaultPath) {
    yield put(setDownloadFolder(chosenPath));
  }
}

function* handleRevealPathInFinderSaga({ path }: revealPathInFinderAction): SagaIterator {
  if (path) {
    yield call([remoteShell, 'openPath'], path);
  }
}

export default function* main(): SagaIterator {
  const onWillDownloadChannel = serviceAddObserverChannel(services.download, 'onWillDownload', 'will-download');

  yield all([
    takeEveryWitness(NEW_ITEM, addDownloadItemSaga),
    takeEveryWitness(REHYDRATION_COMPLETE, initDefaultDownloadFolderSaga),
    takeEveryWitness(SET_DOWNLOAD_FOLDER, handleSetDownloadFolder),
    takeEveryWitness(DOWNLOAD_FOLDER_BROWSE_CLICK, handleChangeDownloadFolderSaga),
    takeEveryWitness(onWillDownloadChannel, handleDownloadSaga),
    takeEveryWitness(REVEAL_PATH_IN_FINDER, handleRevealPathInFinderSaga),
  ]);

  // When exit station app, close the download channel;
  services.electronApp.addObserver(observer({
    onPrepareQuit() {
      onWillDownloadChannel.close();
    },
  }));
}
