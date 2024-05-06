import { StationUserIdentityImmutable } from './types';

export const getIdentityId = (identity: StationUserIdentityImmutable) =>
  identity.get('identityId');

export const getIdentityProvider = (identity: StationUserIdentityImmutable): string =>
  identity.getIn(['provider']);

export const getDisplayName = (identity: StationUserIdentityImmutable): string =>
  identity.getIn(['profileData', 'displayName']);

export const getEmail = (identity: StationUserIdentityImmutable): string =>
  identity.getIn(['profileData', 'email']);

export const getImageURL = (identity: StationUserIdentityImmutable): string =>
  identity.getIn(['profileData', 'imageURL']);
