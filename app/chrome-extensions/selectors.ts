import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { StationState } from '../types';
import { Extension } from './types';
import { StatusState } from './duck';

export const getExtensions = (state: StationState) =>
  state.get('chromeExtensions');

export const getExtensionsLoaded = createSelector(
  getExtensions,
  extensions => extensions.get('loaded')
);

export const getLoadedExtensionIds = createSelector(getExtensionsLoaded, (loadedExtensions) => {
  return loadedExtensions.keySeq().toArray();
});

export const getExtensionsUpdatable = createSelector(
  getExtensions,
  extensions => extensions.get('updatable')
);

export const getExtensionsChecking = createSelector(
  getExtensions,
  extensions => extensions.get('checking')
);

export const getExtensionState = createCachedSelector(
  getExtensionsLoaded,
  getExtensionsUpdatable,
  getExtensionsChecking,
  (_state: StationState, extensionId: Extension['id']) => extensionId,
  (
    loadedExtensions,
    updatedExtensions,
    extensionsInChecking,
    extensionId
  ) => {
    const extensionLoaded = loadedExtensions.get(extensionId);

    if (!extensionLoaded) {
      return { status: StatusState.Unloaded };
    }

    const extensionUpdated = updatedExtensions.get(extensionId);

    if (extensionUpdated) {
      return {
        status: StatusState.Updatable,
        extension: extensionLoaded.toJS(),
        extensionUpdate: extensionUpdated.toJS(),
      };
    }

    const extensionChecking = extensionsInChecking.get(extensionId);

    if (extensionChecking) {
      return {
        status: StatusState.CheckingForUpdate,
        extension: extensionLoaded.toJS(),
      };
    }

    return {
      status: StatusState.Loaded,
      extension: extensionLoaded.toJS(),
    };
  }
)(
  (_state, extensionId: Extension['id']) => extensionId
);
