import arrayUniq = require('array-uniq');
import createCachedSelector from 're-reselect';
import { StationState } from '../types';
import { getEmail, getIdentityId, getImageURL } from './get';
import { StationUserIdentitiesImmutable, StationUserIdentityImmutable } from './types';

// provider which key is 'auth0-google-oauth2' should be returned
// if we ask for provider Google
const normalizeProviderName = (provider: string) => {
  switch (provider) {
    case 'google':
    case 'auth0-google-oauth2':
    case 'google-oauth2':
      return 'google';
    case 'auth0-auth0':
    case 'auth0':
      return 'auth0';
    default:
      return provider;
  }
};

export const getIdentitiesForProvider = (state: StationState, providers: string | string[]): StationUserIdentitiesImmutable => {
  const _providers = Array.isArray(providers) ? providers : [providers];
  return state.get('userIdentities')
    .filter((identity: StationUserIdentityImmutable) => {
      const provider = normalizeProviderName(identity.get('provider'));
      return _providers.includes(provider);
    });
};

export const getSimpleIdentitiesForProvider = createCachedSelector(
  [getIdentitiesForProvider],
  (identities: StationUserIdentitiesImmutable) => {
    return identities
      .map((identity: StationUserIdentityImmutable) => ({
        type: normalizeProviderName(identity.get('provider')),
        id: getIdentityId(identity),
        email: getEmail(identity),
        imageURL: getImageURL(identity),
      }))
      .groupBy(i => i!.email)
      .map(i => i!.first())
      .toList()
      .toJS();
  }
)((_state: StationState, providers: string | string[]) => Array.isArray(providers) ? providers.join('') : providers);

export const getIdentitiesCountForProvider = (state: StationState, providers: string | string[]) =>
  getIdentitiesForProvider(state, providers).size;

export const getFirstIdentityForProvider = (state: StationState, providers: string | string[]) : StationUserIdentityImmutable | null => {
  const identities = getIdentitiesForProvider(state, providers);
  return identities.size === 0 ? null : identities.first();
};

export const getIdentityById = (state: StationState, identityId: string): StationUserIdentityImmutable | undefined =>
  state.getIn(['userIdentities', identityId]);

export const getAllEmails = (state: StationState): string[] =>
  arrayUniq(state.get('userIdentities').toArray().filter(getEmail).map(getEmail));
