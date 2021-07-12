import { put, all } from 'redux-saga/effects';
import * as downloads from '../downloads/duck';
import * as dlToasters from './duck';
import { takeEveryWitness } from '../utils/sagas';

function* onAddDownloadItem(action) {
  yield put(dlToasters.addToastForDownload(action.downloadId));
}

export default function* main() {
  yield all([
    takeEveryWitness(downloads.ADD_ITEM, onAddDownloadItem),
  ]);
}
