import { StationState } from '../types';
import { OnboardingType } from './types';

export const getUI = (state: StationState) => state.get('ui');

export const getUILeftDockApplicationTabAdded = (state: StationState) =>
  state.getIn(['ui', 'applicationTabAdded']);

export const getCursorIcon = (state: StationState): string =>
  state.getIn(['ui', 'cursorIcon'], 'default');

export const getUISettingsActiveTabTitle = (state: StationState): string =>
  state.getIn(['ui', 'settings', 'activeTabTitle'], 'General');

export const getUISettingsIsVisible = (state: StationState): boolean =>
  state.getIn(['ui', 'settings', 'isVisible'], false);

export const getUISettingsManifestURL = (state: StationState): string | undefined =>
  state.getIn(['ui', 'settings', 'selectedManifestURL']);

export const getUIQSHighlightedItemId = (state: StationState): string | undefined =>
  state.getIn(['ui', 'qs', 'highlightedItemId']);

export const getUIRecentSubdockHighlightedItemId = (state: StationState): string | undefined =>
  state.getIn(['ui', 'recentSubdock', 'highlightedItemId']);

export const getUIRecentSubdockIsVisible = (state: StationState): boolean =>
  state.getIn(['ui', 'recentSubdock', 'isVisible'], false);

export const getUIOnboardingStep = (state: StationState): number | undefined =>
  state.getIn(['ui', 'onboarding', 'step']);

export const getUIOnboardingSessionId = (state: StationState): string | undefined =>
  state.getIn(['ui', 'onboarding', 'onboardingSessionId']);

export const getUIOnboardingType = (state: StationState): OnboardingType =>
  state.getIn(['ui', 'onboarding', 'onboardingType']);
