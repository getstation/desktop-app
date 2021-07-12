import { RecursiveImmutableMap } from '../types';

export interface StationNotification {
  notificationId: string,
  title: string,
  timestamp: number,
  applicationId?: string,
  tabId?: string,
  webContentsId?: number,
  body?: string,
  icon?: string,
  full?: boolean,
  silent?: boolean,
}

export type StationNotifications = Partial<Record<string, StationNotification>>;

export type ImmutableNotification = RecursiveImmutableMap<StationNotification>;
export type ImmutableNotifications = RecursiveImmutableMap<StationNotifications>;
