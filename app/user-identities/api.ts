import { people_v1 } from 'googleapis/build/src/apis/people/v1';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { Omit } from '../types';
import services from '../services/servicesManager';
import { StationUserIdentity } from './types';

// utils
const processGoogleAuthData = (data: { profile: people_v1.Schema$Person, tokens: Credentials }): Omit<StationUserIdentity, 'identityId'> => {
  const { profile, tokens } = data;
  const nameObject = profile.names ? profile.names[0] : {};
  const emailObject = profile.emailAddresses ? profile.emailAddresses[0] : {}; 
  const photoObject = profile.photos ? profile.photos[0] : {}; 
  return {
    provider: 'google',
    userId: nameObject.metadata?.source?.id || 'undefined',
    profileData: {
      displayName: nameObject.displayName || '',
      firstName: nameObject.givenName || '',
      lastName: nameObject.familyName || '',
      email: emailObject.value || '',
      imageURL: photoObject.url || '',
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
