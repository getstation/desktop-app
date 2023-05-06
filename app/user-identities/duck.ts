import * as Immutable from 'immutable';
import { fromJS } from '../utils/ts';
import { AuthProviders, StationUserIdentitiesImmutable } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Constants

export const CREATE = 'browserX/user-identities/CREATE';
export type CREATE = 'browserX/user-identities/CREATE';
export const DELETE = 'browserX/user-identities/DELETE';
export type DELETE = 'browserX/user-identities/DELETE';
export const SIGNIN_REQUESTED = 'browserX/user-identities/SIGNIN_REQUESTED';
export type SIGNIN_REQUESTED = 'browserX/user-identities/SIGNIN_REQUESTED';
export const SIGNIN_ERROR = 'browserX/user-identities/SIGNIN_ERROR';
export type SIGNIN_ERROR = 'browserX/user-identities/SIGNIN_ERROR';
export const REQUEST_SIGNIN_THEN_ADD_APPLICATION = 'browserX/user-identities/REQUEST_SIGNIN_THEN_ADD_APPLICATION';
export type REQUEST_SIGNIN_THEN_ADD_APPLICATION = 'browserX/user-identities/REQUEST_SIGNIN_THEN_ADD_APPLICATION';

export type AddedApplicationVia =
  'appstore'
  | 'subdock'
  | 'deeplink-auto-install'
  | 'onboarding'
  | 'settings-app-add-account'
  | 'settings-app-install-extension';

// Action Types

export type CreateIdentityAction = {
  type: CREATE,
  identityId: string,
  provider: string,
  userId: string,
  accessToken?: string,
  refreshToken?: string,
  profileData: any,
};
export type RequestSignInAction = { type: SIGNIN_REQUESTED, provider: AuthProviders, options: any };
export type RequestSignInThenAddAppAction = {
  type: REQUEST_SIGNIN_THEN_ADD_APPLICATION,
  provider: AuthProviders,
  options: any,
  manifestURL: string,
  via: AddedApplicationVia,
};
export type SignInErrorAction = { type: SIGNIN_ERROR, err: string };
export type DeleteIdentityAction = { type: DELETE, identityId: string };
export type UserIdentityActions =
  CreateIdentityAction
  | RequestSignInAction
  | RequestSignInThenAddAppAction
  | SignInErrorAction
  | DeleteIdentityAction;

// Action creators

export const requestSignIn = (provider: AuthProviders, options = { scopes: [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
] }): RequestSignInAction => ({
  type: SIGNIN_REQUESTED, provider, options,
});

export const requestSignInThenAddApplication = (
  provider: AuthProviders,
  options: any,
  manifestURL: string,
  via: AddedApplicationVia,
): RequestSignInThenAddAppAction => {
  return {
    type: REQUEST_SIGNIN_THEN_ADD_APPLICATION, provider, options, manifestURL, via,
  };
};

export const signinError = (err: string): SignInErrorAction => ({
  type: SIGNIN_ERROR, err,
});

export const createIdentity =
  ({ provider, userId, profileData, accessToken, refreshToken }:
     { provider: string, userId: string, profileData: any, accessToken?: string, refreshToken?: string }): CreateIdentityAction => ({
       type: CREATE,
       identityId: `${provider}-${userId}`, // ensure unicity
       provider,
       userId,
       accessToken,
       refreshToken,
       profileData,
     });

export const deleteIdentity = (identityId: string): DeleteIdentityAction => ({
  type: DELETE, identityId,
});

// Reducer
export default function reducer(state: StationUserIdentitiesImmutable = Immutable.Map() as any, action: UserIdentityActions):
  StationUserIdentitiesImmutable {
  switch (action.type) {
    case CREATE: {
      const {
        identityId,
        provider,
        userId,
        profileData,
        accessToken,
        refreshToken,
      } = action;
      return state.set(identityId, fromJS({
        identityId,
        provider,
        userId,
        accessToken,
        refreshToken,
        profileData,
      }));
    }
    case DELETE: {
      const { identityId } = action;
      return state.delete(identityId);
    }
    default:
      return state;
  }
}
