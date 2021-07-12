import { RecursiveImmutableMap } from '../types';

export type StationApplication = {
  applicationId: string,
  iconURL: string,
  manifestURL: string,
  installContext?: InstallContext,
  badge: string,
  activeTab: string,
  zoomLevel: string,
  identityId: string,
  subdomain: string,
  customURL: string,
  notificationsEnabled: boolean,
};

export type StationApplications = Partial<Record<string, StationApplication>>;

export type ApplicationImmutable = RecursiveImmutableMap<StationApplication>;
export type ApplicationsImmutable = RecursiveImmutableMap<StationApplications>;

export enum Platform {
  AppStore = 'appstore',
}

export type InstallContext = {
  id: string,
  platform: Platform,
  onboardeeApplicationAssignmentId?: string,
};
