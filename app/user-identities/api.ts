import { Schema$Person } from 'googleapis/build/src/apis/plus/v1';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { Omit } from '../types';
import services from '../services/servicesManager';
import { StationUserIdentity } from './types';

// utils
const processGoogleAuthData = (data: { profile: Schema$Person, tokens: Credentials }): Omit<StationUserIdentity, 'identityId'> => {
  const { profile, tokens } = data;
  const name = profile.name || {};
  return {
    provider: 'google',
    userId: profile.id,
    profileData: {
      displayName: profile.displayName,
      firstName: name.givenName,
      lastName: name.familyName,
      email: profile.emails[0].value,
      imageURL: profile.image.url,
    },
    accessToken: tokens.access_token || undefined,
    refreshToken: tokens.refresh_token || undefined,
  };
};

export class GoogleSigninError extends Error {
  originalError: Error;
  name: string = 'GoogleSigninError';

  constructor(originalError: Error) {
    super(originalError.message);
    this.originalError = originalError;
  }
}

export function signInWithGoogle(scopes: string[]): Promise<any> {
  return services.electronGoogleOAuth
    .signIn(scopes, true)
    .then(processGoogleAuthData)
    .catch((err: Error) => {
      throw new GoogleSigninError(err);
    });
}
