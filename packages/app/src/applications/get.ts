import { ApplicationImmutable } from './types';

export const getApplicationManifestURL = (application: ApplicationImmutable) => application.get('manifestURL');

export const getApplicationId = (application: ApplicationImmutable) => application.get('applicationId');

export const getApplicationBadge = (application: ApplicationImmutable) => application.get('badge');

export const getApplicationIconURL = (application: ApplicationImmutable) => application.get('iconURL');

export const getApplicationZoomLevel = (application: ApplicationImmutable) => application.get('zoomLevel');

export const getApplicationActiveTab = (application: ApplicationImmutable) => application.get('activeTab');

export const getApplicationIdentityId = (application: ApplicationImmutable) => application.get('identityId');

export const getApplicationSubdomain = (application: ApplicationImmutable) => application.get('subdomain');

export const getApplicationCustomURL = (application: ApplicationImmutable) => application.get('customURL');

export const getInstallContext = (application: ApplicationImmutable) => application.get('installContext');

export const getConfigData = (application: ApplicationImmutable) => ({
  identityId: application.get('identityId'),
  subdomain: application.get('subdomain'),
  customURL: application.get('customURL'),
});
