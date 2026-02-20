import * as Immutable from 'immutable';
import { createSelector } from 'reselect';
import { StationState, RecursiveImmutableMap } from '../types';

export const getTabWebcontents = (state: StationState): Immutable.Map<string, any> =>
  state.get('tabWebcontents');

export const getTabWebcontentsById = (state: StationState, id: string): Immutable.Map<string, any> =>
  getTabWebcontents(state).get(id);

export const getWebcontentsIdForTabId = (state: StationState, tabId: string): number =>
  getWebcontentsId(getTabWebcontents(state).get(tabId, Immutable.Map()));

export const getWebcontentsIdsByTabIds = (state: StationState, tabIds: string[]): number[] => {
  const contents = getTabWebcontents(state);

  if (!contents) return [];
  return tabIds
    .map(tabId => contents.get(tabId))
    .filter(Boolean)
    .map(getWebcontentsId);
};

export const getTabWebcontentsByWebContentsId = (state: StationState, webContentsId: number): Immutable.Map<string, any> =>
  tabWebcontentsIndexedByWebcontentsId(state).get(webContentsId);

export const tabWebcontentsIndexedByWebcontentsId = createSelector(getTabWebcontents,
  tabWebcontents => tabWebcontents.mapKeys((_tabId: string, twc) => getWebcontentsId(twc))
);

// Getters

export const getWebcontentsId = (webcontent: Immutable.Map<string, any>): number =>
  webcontent.get('webcontentsId');

export const getWebcontentsTabId = (webcontent: Immutable.Map<string, any>): string =>
  webcontent.get('tabId');

export const hasWebcontentsId = (webcontent: Immutable.Map<string, any>): boolean =>
  webcontent && webcontent.has('webcontentsId');

export const getWebcontentsCrashed = (webcontent: Immutable.Map<string, any>): boolean =>
  webcontent && webcontent.get('crashed', false);

export const getWebcontentsMountState = (webcontent: Immutable.Map<string, any>): string =>
  webcontent.get('mountState');

export const getWebcontentsMountedAt = (webcontent: Immutable.Map<string, any>): string =>
  webcontent.get('mountedAt');

export const isWebcontentsWaitingToAttach = (webcontent: Immutable.Map<string, any>): boolean =>
  webcontent.get('mountState') === 'waitingToAttach';

export const isWebcontentsDetaching = (webcontent: Immutable.Map<string, any>): boolean =>
  webcontent.get('mountState') === 'detaching';

export const isWebcontentsMounted = (webcontent: Immutable.Map<string, any>): boolean =>
  webcontent.get('mountState') === 'mounted';

export const getWebcontentsErrorCode = (webcontent: Immutable.Map<string, any>) => {
  if (webcontent && typeof webcontent.get('errorCode') === 'number') {
    return webcontent.get('errorCode');
  }
  return null;
};

export const getWebcontentsErrorDescription = (webcontent: Immutable.Map<string, any>) => {
  if (webcontent && webcontent.get('errorDescription')) {
    return webcontent.get('errorDescription');
  }
  return null;
};

export const getWebcontentsAuthState = (webcontent: Immutable.Map<string, any>): boolean =>
  webcontent && webcontent.get('basicAuth');

export const getWebcontentsAuthInfo = (webcontent: Immutable.Map<string, any>): RecursiveImmutableMap<Electron.AuthInfo> =>
  webcontent && webcontent.get('basicAuthInfo');

export const hasAnyMountedTab = createSelector(
  getTabWebcontents,
  (tabWebcontents) => tabWebcontents.some(twc => isWebcontentsMounted(twc))
);
