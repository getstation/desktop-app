import * as Immutable from 'immutable';
import { fromJS } from '../utils/ts';
import { ImmutableNotifications } from './types';

// Types

export type RequestForApplicationNotifications = {
  applicationId: string,
  tabId: string,
  notificationId: string,
  props: any,
  step: RequestForApplicationNotificationsStep,
  applicationName?: string,
  applicationIcon?: string,
};

export enum RequestForApplicationNotificationsStep {
  ASK,
  ENABLE,
  DISABLE,
  FINISH,
}

// Constants

export type ADD_NOTIFICATION = 'browserX/notifications/ADD';
export const ADD_NOTIFICATION = 'browserX/notifications/ADD';
export type REMOVE_NOTIFICATION = 'browserX/notifications/REMOVE';
export const REMOVE_NOTIFICATION = 'browserX/notifications/REMOVE';
export type CLEAR_NOTIFICATIONS = 'browserX/notifications/CLEAR';
export const CLEAR_NOTIFICATIONS = 'browserX/notifications/CLEAR';

// Action Types

export type AddNotificationAction = {
  type: ADD_NOTIFICATION,
  notificationId: string,
  applicationId: string | undefined,
  tabId: string | undefined,
  webContentsId: string | undefined,
  title: string,
  timestamp: number,
  body?: string,
  icon?: string,
  full?: boolean,
  silent?: boolean,
};
export type RemoveNotificationAction = { type: REMOVE_NOTIFICATION, notificationId: string };
export type ClearNotificationsAction = { type: CLEAR_NOTIFICATIONS };
export type NotificationsActions =
  AddNotificationAction
  | RemoveNotificationAction
  | ClearNotificationsAction;

// Action creators

export const addNotification = (notificationId: string, args: {
  applicationId: string | undefined,
  tabId: string | undefined,
  webContentsId: string | undefined,
  title: string,
  timestamp: number,
  body?: string,
  icon?: string,
  full?: boolean,
  silent?: boolean,
}): AddNotificationAction => ({
  type: ADD_NOTIFICATION, notificationId, ...args,
});

export const removeNotification = (notificationId: string): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION, notificationId,
});

export const clearNotifications = (): ClearNotificationsAction => ({
  type: CLEAR_NOTIFICATIONS,
});

// Reducer
const defaultState = Immutable.Map() as ImmutableNotifications;
export default function notifications(state: ImmutableNotifications = defaultState, action: NotificationsActions) {
  switch (action.type) {

    case ADD_NOTIFICATION: {
      const { notificationId, applicationId, tabId, title, timestamp, body, icon, full, silent, webContentsId } = action;
      return state.set(notificationId, fromJS({
        notificationId,
        applicationId,
        tabId,
        webContentsId,
        title,
        timestamp,
        body,
        icon,
        full,
        silent,
      }));
    }

    case REMOVE_NOTIFICATION: {
      return state.remove(action.notificationId);
    }

    case CLEAR_NOTIFICATIONS: {
      return Immutable.Map();
    }

    default:
      return state;

  }
}
