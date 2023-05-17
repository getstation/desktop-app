import { shell as remoteShell } from '@electron/remote';
import { Set } from 'immutable';

// actions
const ADD = 'browserX/dl-toaster/ADD';
const REMOVE = 'browserX/dl-toaster/REMOVE';

// action creators
export const addToastForDownload = downloadId => ({
  type: ADD,
  downloadId
});

export const removeToastForDownload = downloadId => ({
  type: REMOVE,
  downloadId
});

export const openDownloadedFile = downloadId => (dispatch, getState) => {
  const state = getState();
  const filePath = state.getIn(['downloads', downloadId, 'filePath']);
  remoteShell.openPath(filePath);
};

// reducer
export default function reducer(state = new Set(), action) {
  switch (action.type) {
    case ADD: {
      return state.add(action.downloadId);
    }
    case REMOVE: {
      return state.delete(action.downloadId);
    }
    default:
      return state;
  }
}
