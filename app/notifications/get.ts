import * as Immutable from 'immutable';
import * as Moment from 'moment';
import { ImmutableNotification } from './types';

export const getNotificationId = (notif: ImmutableNotification): string => notif.get('notificationId');

export const getNotificationApplicationId = (notif: ImmutableNotification): string | undefined => notif.get('applicationId');

export const getNotificationTabId = (notif: ImmutableNotification): string | undefined => notif.get('tabId');

export const getNotificationWebContentsId = (notif: ImmutableNotification): number | undefined => notif.get('webContentsId');

export const getNotificationTitle = (notif: ImmutableNotification): string => notif.get('title');

export const getNotificationBody = (notif: ImmutableNotification): string => notif.get('body');

export const getNotificationIcon = (notif: ImmutableNotification): string => notif.get('icon');

export const getNotificationTimestamp = (notif: ImmutableNotification): string => notif.get('timestamp');

export const isNotificationFull = (notif: ImmutableNotification): boolean => notif.get('full', false);

export const getNotificationOptions = (notif: ImmutableNotification) => ({
  silent: notif.get('silent', false),
});

// Extended attribute
export const getNotificationBadge = (notif: Immutable.Map<string, any>): string => notif.get('badge');

export const getNotificationDateFromNow = (notif: ImmutableNotification): string => {
  const timestamp = notif.get('timestamp');
  const moment = Moment(timestamp);
  return moment.fromNow();
};
