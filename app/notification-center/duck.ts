import * as Immutable from 'immutable';
import { NotificationProps, StationNotificationImmutable } from './types';
import { RequestForApplicationNotificationsStep } from '../notifications/duck';

// Constants

export type TOGGLE_VISIBILITY = 'browserX/notification-center/TOGGLE_VISIBILITY';
export const TOGGLE_VISIBILITY = 'browserX/notification-center/TOGGLE_VISIBILITY';
export type SET_VISIBILITY = 'browserX/notification-center/SET_VISIBILITY';
export const SET_VISIBILITY = 'browserX/notification-center/SET_VISIBILITY';
export type APPEND_NOTIFICATION = 'browserX/notification-center/APPEND_NOTIFICATION';
export const APPEND_NOTIFICATION = 'browserX/notification-center/APPEND_NOTIFICATION';
export type REMOVE_NOTIFICATION = 'browserX/notification-center/REMOVE_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'browserX/notification-center/REMOVE_NOTIFICATION';
export type REMOVE_ALL_NOTIFICATIONS = 'browserX/notification-center/REMOVE_ALL_NOTIFICATIONS';
export const REMOVE_ALL_NOTIFICATIONS = 'browserX/notification-center/REMOVE_ALL_NOTIFICATIONS';
export type SET_SNOOZE_DURATION = 'browserX/notification-center/SET_SNOOZE_DURATION';
export const SET_SNOOZE_DURATION = 'browserX/notification-center/SET_SNOOZE_DURATION';
export type RESET_SNOOZE_DURATION = 'browserX/notification-center/RESET_SNOOZE_DURATION';
export const RESET_SNOOZE_DURATION = 'browserX/notification-center/RESET_SNOOZE_DURATION';
export type SET_SNOOZE_STARTED_ON = 'browserX/notification-center/SET_SNOOZE_STARTED_ON';
export const SET_SNOOZE_STARTED_ON = 'browserX/notification-center/SET_SNOOZE_STARTED_ON';
export type RESET_SNOOZE_STARTED_ON = 'browserX/notification-center/RESET_SNOOZE_STARTED_ON';
export const RESET_SNOOZE_STARTED_ON = 'browserX/notification-center/RESET_SNOOZE_STARTED_ON';
export type NEW_NOTIFICATION = 'browserX/notification-center/NEW_NOTIFICATION';
export const NEW_NOTIFICATION = 'browserX/notification-center/NEW_NOTIFICATION';
export type NOTIFICATION_CLICK = 'browserX/notification-center/NOTIFICATION_CLICK';
export const NOTIFICATION_CLICK = 'browserX/notification-center/NOTIFICATION_CLICK';
export type MARK_AS_READ = 'browserX/notification-center/MARK_AS_READ';
export const MARK_AS_READ = 'browserX/notification-center/MARK_AS_READ';
export type MARK_ALL_AS_READ = 'browserX/notification-center/MARK_ALL_AS_READ';
export const MARK_ALL_AS_READ = 'browserX/notification-center/MARK_ALL_AS_READ';
export type SHOW_NOTIFICATION = 'browserX/notification-center/SHOW_NOTIFICATION';
export const SHOW_NOTIFICATION = 'browserX/notification-center/SHOW_NOTIFICATION';

// Action Types

export type ToggleVisibilityAction = { type: TOGGLE_VISIBILITY };
export type SetVisibilityAction = { type: SET_VISIBILITY, visible: boolean };
export type AppendNotiticationAction = { type: APPEND_NOTIFICATION, notificationId: string };
export type MarkAsReadAction = { type: MARK_AS_READ, notificationId: string };
export type MarkAllAsReadAction = { type: MARK_ALL_AS_READ };
export type RemoveNotificationAction = { type: REMOVE_NOTIFICATION, notificationId: string };
export type RemoveAllNotificationsAction = { type: REMOVE_ALL_NOTIFICATIONS };
export type SetSnoozeDurationAction = { type: SET_SNOOZE_DURATION, via: string, duration: string };
export type ResetSnoozeDurationAction = { type: RESET_SNOOZE_DURATION, via: string };
export type SetSnoozeStartedOnAction = { type: SET_SNOOZE_STARTED_ON, timestamp: number };
export type ResetSnoozeStartedOnAction = { type: RESET_SNOOZE_STARTED_ON };
export type NewNotificationAction = {
  type: NEW_NOTIFICATION,
  applicationId: string | undefined,
  tabId: string | undefined,
  notificationId: string,
  props: NotificationProps,
  options: NewNotificationOptions,
};
export type AskEnableNotificationsAction = NewNotificationAction &
  { applicationId: string, tabId: string, step: RequestForApplicationNotificationsStep };
export type NotificationClickAction = { type: NOTIFICATION_CLICK, notificationId: string, interfaceType: string };
export type ShowNotificationAction = { type: SHOW_NOTIFICATION, notificationId: string };
export type NotificationCenterActions =
  ToggleVisibilityAction
  | SetVisibilityAction
  | AppendNotiticationAction
  | MarkAsReadAction
  | MarkAllAsReadAction
  | RemoveNotificationAction
  | RemoveAllNotificationsAction
  | SetSnoozeDurationAction
  | ResetSnoozeDurationAction
  | SetSnoozeStartedOnAction
  | ResetSnoozeStartedOnAction
  | NewNotificationAction
  | NotificationClickAction
  | ShowNotificationAction;

// Other types

export type NewNotificationOptions = { full?: boolean, silent?: boolean, webContentsId?: string };

// Action creators

export const toggleVisibility = (): ToggleVisibilityAction => ({ type: TOGGLE_VISIBILITY });

export const setVisibility = (visible: boolean): SetVisibilityAction => ({ type: SET_VISIBILITY, visible });

export const appendNotification = (notificationId: string): AppendNotiticationAction => ({
  type: APPEND_NOTIFICATION, notificationId,
});

export const removeNotification = (notificationId: string): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION, notificationId,
});

export const removeAllNotifications = (): RemoveAllNotificationsAction => ({
  type: REMOVE_ALL_NOTIFICATIONS,
});

export const markAsRead = (notificationId: string): MarkAsReadAction => ({
  type: MARK_AS_READ, notificationId,
});

export const markAllAsRead = (): MarkAllAsReadAction => ({
  type: MARK_ALL_AS_READ,
});

export const setSnoozeDuration = (via: string, duration: string): SetSnoozeDurationAction => ({
  type: SET_SNOOZE_DURATION, via, duration,
});

export const resetSnoozeDuration = (via: string): ResetSnoozeDurationAction => ({
  type: RESET_SNOOZE_DURATION, via,
});

export const setSnoozeStartedOn = (timestamp: number): SetSnoozeStartedOnAction => ({
  type: SET_SNOOZE_STARTED_ON, timestamp,
});

export const resetSnoozeStartedOn = (): ResetSnoozeStartedOnAction => ({
  type: RESET_SNOOZE_STARTED_ON,
});

export const newNotification = (applicationId: string | undefined,
                                tabId: string | undefined,
                                notificationId: string,
                                props: NotificationProps,
                                options: NewNotificationOptions = {}): NewNotificationAction => ({
                                  type: NEW_NOTIFICATION, applicationId, tabId, notificationId, props, options,
                                });

export const notificationClick = (notificationId: string, interfaceType: string): NotificationClickAction => ({
  type: NOTIFICATION_CLICK, notificationId, interfaceType,
});

export const showNotification = (notificationId: string): ShowNotificationAction => ({
  type: SHOW_NOTIFICATION, notificationId,
});

// Reducer

const defaultMap = Immutable.Map({
  notifications: Immutable.List(),
}) as StationNotificationImmutable;
export default function notificationCenter(state: StationNotificationImmutable = defaultMap, action: NotificationCenterActions) {
  switch (action.type) {
    case SET_VISIBILITY: {
      return state.set('isVisible', action.visible);
    }

    case APPEND_NOTIFICATION: {
      return state.update('notifications', notifs => notifs.push(action.notificationId));
    }

    case REMOVE_NOTIFICATION: {
      const index = state.get('notifications').indexOf(action.notificationId);
      if (index !== -1) {
        return state.update('notifications', notifs => notifs.remove(index));
      }
      return state;
    }

    case REMOVE_ALL_NOTIFICATIONS: {
      return state.set('notifications', Immutable.List() as any);
    }

    case SET_SNOOZE_DURATION: {
      return state.set('snoozeDuration', action.duration);
    }

    case RESET_SNOOZE_DURATION: {
      return state.remove('snoozeDuration');
    }

    case SET_SNOOZE_STARTED_ON : {
      return state.set('snoozeStartedOn', action.timestamp);
    }

    case RESET_SNOOZE_STARTED_ON : {
      return state.remove('snoozeStartedOn');
    }

    default:
      return state;

  }
}
