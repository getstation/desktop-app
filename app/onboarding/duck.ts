import * as Immutable from 'immutable';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Actions
export const MARK_AS_DONE = 'browserX/onboarding/MARK_AS_DONE';
export type MARK_AS_DONE = 'browserX/onboarding/MARK_AS_DONE';
export const START = 'browserX/onboarding/START';
export type START = 'browserX/onboarding/START';
export const APP_STORE_STEP_FINISHED = 'browserX/onboarding/APP_STORE_STEP';
export type APP_STORE_STEP_FINISHED = 'browserX/onboarding/APP_STORE_STEP';
export const DISABLE_APPLICATION_STORE_TOOLTIP = 'browserX/onboarding/DISABLE_APPLICATION_STORE_TOOLTIP';
export type DISABLE_APPLICATION_STORE_TOOLTIP = 'browserX/onboarding/DISABLE_APPLICATION_STORE_TOOLTIP';
export const SET_SLEEP_NOTIFICATION = 'browserX/onboarding/SET_SLEEP_NOTIFICATION';
export type SET_SLEEP_NOTIFICATION = 'browserX/onboarding/SET_SLEEP_NOTIFICATION';

// Action Types
export type MarkOnboardingAsDoneAction = { type: MARK_AS_DONE, done: boolean };
export type StartOnboardingAction = { type: START };
export type AppStoreStepFinishedAction = {
  type: APP_STORE_STEP_FINISHED,
  nbInstalledApps: number,
  onboardeeId?: string,
};
export type DisableApplicationStoreTooltipAction = { type: DISABLE_APPLICATION_STORE_TOOLTIP };
export type SetSleepNotificationAction = { type: SET_SLEEP_NOTIFICATION, sleepNotification: number };

export type OnboardingActions =
  MarkOnboardingAsDoneAction
  | StartOnboardingAction
  | AppStoreStepFinishedAction
  | DisableApplicationStoreTooltipAction
  | SetSleepNotificationAction;

// Actions creators
export const markOnboardingAsDone = (done = true): MarkOnboardingAsDoneAction => ({
  type: MARK_AS_DONE, done,
});

export const startOnboarding = (): StartOnboardingAction => ({ type: START });

export const appStoreStepFinished = (
  nbInstalledApps: number,
  onboardeeId?: string,
): AppStoreStepFinishedAction => ({
  type: APP_STORE_STEP_FINISHED,
  nbInstalledApps,
  onboardeeId,
});

export const disableApplicationStoreTooltip = (): DisableApplicationStoreTooltipAction => ({ type: DISABLE_APPLICATION_STORE_TOOLTIP });

export const setSleepNotification = (sleepNotification: number): SetSleepNotificationAction =>
  ({ type: SET_SLEEP_NOTIFICATION, sleepNotification });

// Reducer
export default function reducer(state: Immutable.Map<string, any> = Immutable.Map(), action: OnboardingActions) {
  switch (action.type) {
    case MARK_AS_DONE:
      return state.set('done', action.done);

    case DISABLE_APPLICATION_STORE_TOOLTIP:
      return state.set('appStoreTooltipDisabled', true);

    case SET_SLEEP_NOTIFICATION:
      return state.set('sleepNotification', action.sleepNotification);

    default:
      return state;
  }
}
