import { getWindowIsMain, getWindowCurrentTabId } from './get';

export const getWindows = state => state.get('windows');

export const getWindow = (state, windowId) => getWindows(state).get(windowId);

export const getMainWindowId = (state) =>
  getWindows(state).findKey(webview => getWindowIsMain(webview));

export const getWindowIdFromTabId = (state, tabId) => {
  const lookupMap = getWindows(state).mapEntries(([key, val]) => [getWindowCurrentTabId(val), key]);
  return lookupMap.get(tabId, getMainWindowId(state));
};
