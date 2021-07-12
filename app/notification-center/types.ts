import { RecursiveImmutableMap } from '../types';

export interface NotificationProps {
  title: string,
  timestamp?: number,
  body: string,
  icon: string,
}

export interface StationNotification {
  snoozeDuration?: string,
  snoozeStartedOn?: number,
  isVisible?: boolean,
  notifications: string[],
}

export type StationNotificationImmutable = RecursiveImmutableMap<StationNotification>;
