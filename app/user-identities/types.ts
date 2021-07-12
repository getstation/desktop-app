import { RecursiveImmutableMap } from '../types';
export type AuthProviders = 'google' | 'auth0';
export type StationUserIdentity = {
  identityId: string,
  provider: string,
  profileData: {
    displayName: string,
    email: string,
    imageURL: string,
    firstName: string,
    lastName: string,
  },
  userId: string,
  accessToken?: string,
  refreshToken?: string,
};
export type StationUserIdentities = Partial<Record<string, StationUserIdentity>>;
export type StationUserIdentityImmutable = RecursiveImmutableMap<StationUserIdentity>;
export type StationUserIdentitiesImmutable = RecursiveImmutableMap<StationUserIdentities>;
