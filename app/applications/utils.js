import { getApplicationActiveTab } from './get';

export function getFrontActiveTabId(state) {
  const activeApplicationId = state.getIn(['nav', 'tabApplicationId']);
  if (!activeApplicationId) return null;

  const activeApp = state.getIn(['applications', activeApplicationId]);
  if (!activeApp) return null;

  const activeTab = getApplicationActiveTab(activeApp);
  if (!activeTab) return null;

  return activeTab;
}

export function getCurrentActiveTabProperty(state, property) {
  const activeTabId = getFrontActiveTabId(state);
  if (!activeTabId) return false;

  const activeTab = state.getIn(['tabs', activeTabId]);
  if (!activeTab) return false;

  // duplicate from ui/selectors because of recursive dependencies
  const appStoreVisible = state.getIn(['appStore', 'visible']);
  const invitationModalVisible = state.getIn(['ui', 'invitationModal', 'visible']);
  const passwordManagerModalsVisible = false;
  const isOverlayVisible =
    appStoreVisible || invitationModalVisible || passwordManagerModalsVisible;

  if (isOverlayVisible) return false;

  return activeTab.get(property);
}

export function getForeFrontNavigationStateProperty(state, property) {
  return getCurrentActiveTabProperty(state, property);
}
