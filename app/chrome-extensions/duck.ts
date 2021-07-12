import { fromJS } from '../utils/ts';
import { ChromeExtensionsImmutable, Extension } from './types';

export enum StatusState {
  Unloaded,
  Loaded,
  CheckingForUpdate,
  Updatable,
  NoUpdateAvailable,
}

export const SET_AS_LOADED = 'browserX/cx/SET_AS_LOADED';
export type SET_AS_LOADED = typeof SET_AS_LOADED;

export const REMOVE_FROM_LOADED = 'browserX/cx/REMOVE_FROM_LOADED';
export type REMOVE_FROM_LOADED = typeof REMOVE_FROM_LOADED;

export const REMOVE_FROM_CHECKING = 'browserX/cx/REMOVE_FROM_CHECKING';
export type REMOVE_FROM_CHECKING = typeof REMOVE_FROM_CHECKING;

export const CHECK_FOR_UPDATE = 'browserX/cx/CHECK_FOR_UPDATE';
export type CHECK_FOR_UPDATE = typeof CHECK_FOR_UPDATE;

export const UPDATE_IS_AVAILABLE = 'browserX/cx/UPDATE_IS_AVAILABLE';
export type UPDATE_IS_AVAILABLE = typeof UPDATE_IS_AVAILABLE;

export type SetAsLoadedAction = {
  type: SET_AS_LOADED,
  extension: Extension,
};

export type RemoveFromLoadedAction = {
  type: REMOVE_FROM_LOADED,
  extensionId: Extension['id'],
};

export type CheckForUpdateAction = {
  type: CHECK_FOR_UPDATE,
  extension: Extension,
};

export type RemoveFromCheckingAction = {
  type: REMOVE_FROM_CHECKING,
  extensionId: Extension['id'],
};

export type UpdateIsAvailableAction = {
  type: UPDATE_IS_AVAILABLE,
  extension: Extension,
};

export type ChromeExtensionAction =
  SetAsLoadedAction |
  RemoveFromLoadedAction |
  CheckForUpdateAction |
  RemoveFromCheckingAction |
  UpdateIsAvailableAction;

export const setAsLoaded =
  (extension: Extension): SetAsLoadedAction => ({
    type: SET_AS_LOADED,
    extension,
  });

export const removeFromLoaded =
  (extensionId: Extension['id']): RemoveFromLoadedAction => ({
    type: REMOVE_FROM_LOADED,
    extensionId,
  });

export const extensionUpdateIsAvailable =
  (extension: Extension): UpdateIsAvailableAction => ({
    type: UPDATE_IS_AVAILABLE,
    extension,
  });

export const checkForUpdate =
  (extension: Extension): CheckForUpdateAction => ({
    type: CHECK_FOR_UPDATE,
    extension,
  });

export const removeFromChecking =
  (extensionId: Extension['id']): RemoveFromCheckingAction => ({
    type: REMOVE_FROM_CHECKING,
    extensionId,
  });

// @ts-ignore: immutable 'string[]' is not assignable to parameter of type 'Iterable<any, any>' - ImmutableJS is wrongly typed
const defaultStateChromeExtensions: ChromeExtensionsImmutable = fromJS({
  loaded: {},
  updatable: {},
  checking: {},
});

export default function reducer(
  state: ChromeExtensionsImmutable = defaultStateChromeExtensions,
  action: ChromeExtensionAction
) {
  switch (action.type) {
    case SET_AS_LOADED: {
      const { extension } = action;
      // @ts-ignore : see above
      return state.setIn(['loaded', extension.id], fromJS(extension));
    }

    case REMOVE_FROM_LOADED: {
      const { extensionId } = action;
      return state.deleteIn(['loaded', extensionId]);
    }

    case CHECK_FOR_UPDATE: {
      const { extension } = action;
      // @ts-ignore : see above
      return state.setIn(['checking', extension.id], fromJS(extension));
    }

    case REMOVE_FROM_CHECKING: {
      const { extensionId } = action;
      return state.deleteIn(['checking', extensionId]);
    }

    case UPDATE_IS_AVAILABLE: {
      const { extension } = action;
      // @ts-ignore : see above
      return state.setIn(['updatable', extension.id], fromJS(extension));
    }

    default:
      return state;
  }
}
