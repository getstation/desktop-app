import * as Immutable from 'immutable';
import { createSelector } from 'reselect';

import {
  getActiveApplicationId,
} from '../nav/selectors';
import {
  AccountsStep,
  ConfigurationStep,
  UnlockStep,
} from './duck';
import Providers from './providers';

export const getPasswordManagers = (state: Immutable.Map<string, any>) =>
  state.get('passwordManagers');

export const getProvider = createSelector(
  getPasswordManagers,
  passwordManagers => passwordManagers.first()
);

export const getProviderId = () => 'onePassword';

export const getProviderJS = createSelector(
  getProviderId,
  providerId => {
    const provider = Object.assign({}, Providers[providerId]);
    delete provider.runtime;
    return provider;
  }
);

export const getPasswordManager = createSelector(
  getProvider,
  getProviderJS,
  (passwordManagers, providerInformations) => {
    if (passwordManagers && passwordManagers.size > 0) {
      const passwordManager = passwordManagers
        .first()
        .toJS();

      return Object.assign({}, passwordManager,
        { providerId: providerInformations.id, providerName: providerInformations.name });
    }
  }
);

export const getPasswordManagerId = createSelector(
  getPasswordManager,
  passwordManager => passwordManager.id
);

export const getConfigurationProcess = (state: Immutable.Map<string, any>) => {
  const configuration = state.getIn(['passwordManagers', 'configuration']);

  if (configuration) {
    return configuration.toJS();
  }
  return { step: ConfigurationStep.NotStarted };
};

export const getAccounts = (state: Immutable.Map<string, any>) => {
  const accounts = state.getIn(['passwordManagers', 'accounts']);

  if (accounts) {
    return accounts.toJS();
  }
  return { step: AccountsStep.NotAsked };
};

export const getUnlockProcess = (state: Immutable.Map<string, any>) => {
  const unlock = state.getIn(['passwordManagers', 'unlock']);

  if (unlock) {
    return unlock.toJS();
  }
  return { step: UnlockStep.NotAsked };
};

export const getLinks = (state: Immutable.Map<string, any>) =>
  state.get('passwordManagerLinks');

export const getLink = createSelector(
  getLinks,
  (_: any, applicationId: string) => applicationId,
  (links, applicationId: string) => links.get(applicationId)
);

export const getLinkForActiveApplication = createSelector(
  getActiveApplicationId,
  getLinks,
  (applicationId, links) => links.get(applicationId)
);

export const getDisplayBanner = (state: Immutable.Map<string, any>) =>
  state.getIn(['passwordManagers', 'displayBanner']) || false;

export const getDisplayRemoveLinkBanner = (state: Immutable.Map<string, any>) =>
  state.getIn(['passwordManagers', 'displayRemoveLinkBanner']) || false;

export const getLoadingCredentials = (state: Immutable.Map<string, any>) =>
  state.getIn(['passwordManagers', 'loadingCredentials']) || false;
