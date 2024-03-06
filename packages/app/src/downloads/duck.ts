import * as Immutable from 'immutable';

// Actions
export const NEW_ITEM = 'browserX/downloads/NEW_ITEM';
export type NEW_ITEM = 'browserX/downloads/NEW_ITEM';
export const ADD_ITEM = 'browserX/downloads/ADD_ITEM';
export type ADD_ITEM = 'browserX/downloads/ADD_ITEM';
export const UPDATE_ITEM_STATE = 'browserX/downloads/UPDATE_ITEM_STATE';
export type UPDATE_ITEM_STATE = 'browserX/downloads/UPDATE_ITEM_STATE';
export const REMOVE_ALL_ITEMS = 'browserX/downloads/REMOVE_ALL_ITEMS';
export type REMOVE_ALL_ITEMS = 'browserX/downloads/REMOVE_ALL_ITEMS';
export const DOWNLOAD_FOLDER_BROWSE_CLICK = 'browserX/downloads/LOCATION_FOLDER_BROWSE_CLICK ';
export type DOWNLOAD_FOLDER_BROWSE_CLICK = 'browserX/downloads/LOCATION_FOLDER_BROWSE_CLICK ';
export const REVEAL_PATH_IN_FINDER = 'browserX/downloads/REVEAL_PATH_IN_FINDER';
export type REVEAL_PATH_IN_FINDER = 'browserX/downloads/REVEAL_PATH_IN_FINDER';

export type DownloadState = 'progressing' | 'interrupted' | 'completed' | 'cancelled';

// Action Types
export type newItemAction = { type: NEW_ITEM, downloadId: string, filePath: string, webContentsId: number };
export type addItemAction = { type: ADD_ITEM, downloadId: string, filePath: string, applicationId: string | null };
export type updateItemAction = {
  type: UPDATE_ITEM_STATE,
  downloadId: string,
  state?: DownloadState,
  progressRate?: number | undefined,
  endedAt?: number | undefined,
  filePath?: string,
};

export type removeAllItemsAction = { type: REMOVE_ALL_ITEMS };
export type clickBrowseDownloadFolderAction = { type: DOWNLOAD_FOLDER_BROWSE_CLICK };
export type revealPathInFinderAction = { type: REVEAL_PATH_IN_FINDER, path?: string };

export type DownloadActions =
  newItemAction
  | addItemAction
  | updateItemAction
  | removeAllItemsAction
  | clickBrowseDownloadFolderAction
  | revealPathInFinderAction;

// Action creators
export const newItem = (downloadId: string, filePath: string, webContentsId: number): newItemAction => ({
  type: NEW_ITEM, downloadId, filePath, webContentsId,
});

export const addItem = (downloadId: string, filePath: string, applicationId: string | null = null): addItemAction => ({
  type: ADD_ITEM, downloadId, filePath, applicationId,
});

export const updateItemProgress = (
  downloadId: string, state: DownloadState, { progressRate, endedAt }: { progressRate?: number, endedAt?: number }
): updateItemAction => ({
  type: UPDATE_ITEM_STATE, downloadId, state, progressRate, endedAt,
});

export const updateItemPath = (downloadId: string, filePath: string): updateItemAction => ({
  type: UPDATE_ITEM_STATE, downloadId, filePath,
});

export const removeAllItems = (): removeAllItemsAction => ({
  type: REMOVE_ALL_ITEMS,
});

export const clickBrowseDownloadFolder = (): clickBrowseDownloadFolderAction => ({
  type: DOWNLOAD_FOLDER_BROWSE_CLICK,
});

export const revealPathInFinder = (path: string): revealPathInFinderAction => ({
  type: REVEAL_PATH_IN_FINDER,
  path,
});

// Reducer
export default function reducer(state: Immutable.Map<string, any> = Immutable.Map(), action: DownloadActions) {
  switch (action.type) {

    case ADD_ITEM: {
      const { downloadId, filePath, applicationId } = action;
      return state.set(downloadId, Immutable.Map({
        downloadId,
        filePath,
        applicationId,
      }));
    }

    case UPDATE_ITEM_STATE: {
      const { downloadId, filePath, endedAt, progressRate } = action;
      if (!state.has(downloadId)) return state;
      const propsToMerge = {
        state: action.state,
        ...filePath && { filePath },
        ...endedAt && { endedAt },
        ...progressRate && { progressRate },
      };
      return state.mergeIn([downloadId], Immutable.Map(propsToMerge));
    }

    case REMOVE_ALL_ITEMS: {
      return Immutable.Map();
    }

    default:
      return state;

  }
}
