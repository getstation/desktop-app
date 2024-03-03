import * as Immutable from 'immutable';
import { createSelector } from 'reselect';
import { StationState } from '../types';

export const isDone = (state: StationState): boolean =>
  Boolean(state.getIn(['onboarding', 'done'], false));

export const isApplicationStoreTooltipDisabled = (state: StationState): boolean =>
  state.getIn(['onboarding', 'appStoreTooltipDisabled'], false);

export const getSleepNotification = (state: Immutable.Map<string, any>): number | undefined =>
  state.getIn(['onboarding', 'sleepNotification']);

export const getLastInvitationColleagueDate = (state: Immutable.Map<string, any>): number | undefined =>
  state.getIn(['onboarding', 'lastInvitationColleagueDate']);

export const isVisible = createSelector(
  isDone,
  (state: StationState) => state.getIn(['app', 'showLogin'], false) as boolean,
  (onboardingDone, showLogin) => !onboardingDone || showLogin
);
