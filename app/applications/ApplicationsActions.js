import { getActiveApplicationId } from '../nav/selectors';
import { getTabs } from '../tabs/selectors';
import { getTabApplicationId } from '../tabs/get';
import { changeSelectedApp, dispatchUrl, resetZoom, setActiveTab, zoomIn, zoomOut, } from './duck';
import { detach } from '../subwindows/duck';
import { hasSubwindow } from '../subwindows/selectors';
import { getWindowIdFromTabId } from '../windows/selectors';
import { changeAppFocusState } from '../app/duck';
import { getFocusedTabId } from '../app/selectors';

export const resetZoomActiveApp = () => (dispatch, getState) => {
  const tabApplicationId = getActiveApplicationId(getState());
  dispatch(resetZoom(tabApplicationId));
};

export const zoomOutActiveApp = () => (dispatch, getState) => {
  const tabApplicationId = getActiveApplicationId(getState());
  dispatch(zoomOut(tabApplicationId));
};

export const zoomInActiveApp = () => (dispatch, getState) => {
  const tabApplicationId = getActiveApplicationId(getState());
  dispatch(zoomIn(tabApplicationId));
};

export const dispatchURLNavigationActiveApp =
  (url, options) => (dispatch, getState) => {
    const state = getState();
    const origin = { applicationId: getActiveApplicationId(state) };
    return dispatch(dispatchUrl(url, origin, options));
  };

export const detachCurrentlyFocusedApplicationTab = () => (dispatch, getState) => {
  const state = getState();
  const tabId = getFocusedTabId(state);
  if (tabId) {
    dispatch(detach(tabId));
  }
};
