import { StationState } from '../types';
import { ImmutableNotification, ImmutableNotifications } from './types';

export const getNotifications = (state: StationState): ImmutableNotifications =>
  state.get('notifications');

export const getNotificationById = (state: StationState, notificationId: string): ImmutableNotification | undefined =>
  getNotifications(state).get(notificationId);

export const getNotificationsRequests = (state: StationState) =>
  state
    .get('applications')
    .filter((application: any) => application.has('askEnableNotification'))
    .toList();
