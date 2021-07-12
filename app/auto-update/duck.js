import { Map } from 'immutable';

// Actions
export const CHECK_FOR_UPDATES = 'browserX/auto-update/CHECK_FOR_UPDATES';
export const checkForUpdates = () => ({ type: CHECK_FOR_UPDATES });

export const SET_CHECKING_FOR_UPDATE = 'browserX/auto-update/SET_CHECKING_FOR_UPDATE';
export const setCheckingForUpdate = (checking = true) => ({
  type: SET_CHECKING_FOR_UPDATE, checking
});


export const SET_UPDATE_IS_AVAILABLE = 'browserX/auto-update/SET_UPDATE_IS_AVAILABLE';
export const setUpdateIsAvailable = (releaseName) => ({
  type: SET_UPDATE_IS_AVAILABLE,
  releaseName
});

export const SET_DOWNLOADING_AVAILABLE = 'browserX/auto-update/SET_START_DOWNLOADING_AVAILABLE';
export const setDownloadingUpdate = (startDownloading) => ({
  type: SET_DOWNLOADING_AVAILABLE,
  startDownloading
});

export const OPEN_RELEASE_NOTES = 'browserX/auto-update/OPEN_RELEASE_NOTES';
export const openReleaseNotes = () => ({
  type: OPEN_RELEASE_NOTES
});

export const QUIT_AND_INSTALL = 'browserX/auto-update/QUIT_AND_INSTALL';
export const quitAndInstall = () => ({ type: QUIT_AND_INSTALL });

export const SET_RELEASE_NOTES_SUBDOCK_VISIBILITY = 'browserX/auto-update/SET_RELEASE_NOTES_SUBDOCK_VISIBILITY';
export const setReleaseNotesSubdockVisibility = (visible) => ({
  type: SET_RELEASE_NOTES_SUBDOCK_VISIBILITY, visible
});

export const TOGGLE_RELEASE_NOTES_SUBDOCK_VISIBILITY = 'browserX/auto-update/TOGGLE_RELEASE_NOTES_SUBDOCK_VISIBILITY';
export const toggleReleaseNotesSubdockVisibility = () => ({
  type: TOGGLE_RELEASE_NOTES_SUBDOCK_VISIBILITY,
});

// Reducer
export default function reducer(state = new Map(), action) {
  switch (action.type) {

    case SET_DOWNLOADING_AVAILABLE:
      return state
        .set('downloadingUpdate', action.startDownloading);

    case SET_UPDATE_IS_AVAILABLE:
      return state
        .set('startDownloading', false)
        .set('updateAvailable', true)
        .set('releaseName', action.releaseName);

    case SET_CHECKING_FOR_UPDATE:
      return state
        .set('checking', action.checking);

    case SET_RELEASE_NOTES_SUBDOCK_VISIBILITY:
      return state
        .set('isVisible', action.visible);

    case TOGGLE_RELEASE_NOTES_SUBDOCK_VISIBILITY:
      return state
        .update('isVisible', isVisible => !isVisible);

    default:
      return state;

  }
}
