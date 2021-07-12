export const APPLICATION_INSTALLED_TOPIC = 'APPLICATION_INSTALLED';
export type ApplicationInstalledPayload = {
  applicationId: string,
  inBackground?: boolean,
};

export enum AuthenticationChanged {
  Success,
  Failed,
}

export const AUTHENTICATION_CHANGED_TOPIC = 'AUTHENTICATION_CHANGED';
export type AuthenticationChangedPayload = {
  result: AuthenticationChanged,
  timestamp: number,
};
