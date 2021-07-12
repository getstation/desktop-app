import * as Immutable from 'immutable';
import Providers from './providers';
import { Account, PasswordManager, Provider } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Constants

export const enum ConfigurationStep {
  NotStarted,
  Credentials,
  Mfa,
  Test,
  Error,
  Save,
  Saved,
  Cancel,
  Exit,
}

export const enum UnlockStep {
  NotAsked,
  Ask,
  Test,
  Error,
  Finish,
  ExitFromAutofill,
  Exit,
}

export const enum AccountsStep {
  NotAsked,
  WaitConfiguration,
  Ask,
  Load,
  Loaded,
  Unload,
}

export const ADD_PASSWORD_MANAGER = 'browserX/passwordManagers/ADD';
export type ADD_PASSWORD_MANAGER = typeof ADD_PASSWORD_MANAGER;

export const REMOVE_PASSWORD_MANAGER = 'browserX/passwordManagers/REMOVE';
export type REMOVE_PASSWORD_MANAGER = typeof REMOVE_PASSWORD_MANAGER;

export const UNLOCK = 'browserX/passwordManagers/UNLOCK';
export type UNLOCK = typeof UNLOCK;

export const LOAD_ACCOUNTS = 'browserX/passwordManagers/LOAD_ACCOUNTS';
export type LOAD_ACCOUNTS = typeof LOAD_ACCOUNTS;

export const ADD_LINK = 'browserX/passwordManagerLinks/ADD';
export type ADD_LINK = typeof ADD_LINK;

export const REMOVE_LINK = 'browserX/passwordManagerLinks/REMOVE';
export type REMOVE_LINK = typeof REMOVE_LINK;

export const DISPLAY_BANNER = 'browserX/passwordManagers/DISPLAY_BANNER';
export type DISPLAY_BANNER = typeof DISPLAY_BANNER;

export const DISPLAY_REMOVE_LINK_BANNER = 'browserX/passwordManagers/DISPLAY_REMOVE_LINK_BANNER';
export type DISPLAY_REMOVE_LINK_BANNER = typeof DISPLAY_REMOVE_LINK_BANNER;

export const LOAD_CREDENTIALS = 'browserX/passwordManagers/LOAD_CREDENTIALS';
export type LOAD_CREDENTIALS = typeof LOAD_CREDENTIALS;

export const CLOSE_ALL = 'browserX/passwordManagers/CLOSE_ALL';
export type CLOSE_ALL = typeof CLOSE_ALL;

// Action Types

export type AddPasswordManagerAction = {
  type: ADD_PASSWORD_MANAGER,
  step: ConfigurationStep,
  provider: Provider,
  payload?: any,
};

export type RemovePasswordManagerAction = {
  type: REMOVE_PASSWORD_MANAGER,
  passwordManager: PasswordManager,
};

export type UnlockAction = {
  type: UNLOCK,
  step: UnlockStep,
  passwordManager: PasswordManager,
  webcontentsId?: number,
  payload?: any,
};

export type AccountsAction = {
  type: LOAD_ACCOUNTS,
  step: AccountsStep,
  passwordManager?: PasswordManager,
  data?: Account[],
};

export type AddLinkAction = {
  type: ADD_LINK,
  passwordManager: PasswordManager,
  applicationId: string,
  passwordManagerItemId: string,
  login: string,
  avatar?: string,
};

export type RemoveLinkAction = {
  type: REMOVE_LINK,
  applicationId: string,
};

export type DisplayBannerAction = {
  type: DISPLAY_BANNER,
  display: boolean,
};

export type DisplayRemoveLinkBannerAction = {
  type: DISPLAY_REMOVE_LINK_BANNER,
  display: boolean,
};

export type LoadCredentialsAction = {
  type: LOAD_CREDENTIALS,
  load: boolean,
};

export type CloseAllAction = {
  type: CLOSE_ALL,
};

export type PasswordManagersActions =
  AddPasswordManagerAction |
  RemovePasswordManagerAction |
  UnlockAction |
  AccountsAction |
  AddLinkAction |
  RemoveLinkAction |
  DisplayBannerAction |
  DisplayRemoveLinkBannerAction |
  LoadCredentialsAction |
  CloseAllAction;

// Action creators

export const addPasswordManager = (
  { step, provider, payload }: { step: ConfigurationStep, provider: Provider, payload?: any }
  ): AddPasswordManagerAction => ({
    type: ADD_PASSWORD_MANAGER,
    step,
    provider,
    payload,
  });

export const removePasswordManager = (
  { passwordManager }: { passwordManager: PasswordManager }
  ): RemovePasswordManagerAction => ({
    type: REMOVE_PASSWORD_MANAGER,
    passwordManager,
  });

export const unlock = (
  { step, passwordManager, webcontentsId, payload }: {
    step: UnlockStep,
    passwordManager: PasswordManager,
    webcontentsId?: number,
    payload?: any,
  }): UnlockAction => ({
    type: UNLOCK,
    step,
    passwordManager,
    webcontentsId,
    payload,
  });

export const accounts = (
  { step, passwordManager, data }: { step: AccountsStep, passwordManager?: PasswordManager, data?: Account[] }
  ): AccountsAction => ({
    type: LOAD_ACCOUNTS,
    step,
    passwordManager,
    data,
  });

export const addLink = (
  { passwordManager, applicationId, passwordManagerItemId, login, avatar }: {
    passwordManager: PasswordManager,
    applicationId: string,
    passwordManagerItemId: string,
    login: string,
    avatar?: string,
  }): AddLinkAction => ({
    type: ADD_LINK,
    passwordManager,
    applicationId,
    passwordManagerItemId,
    login,
    avatar,
  });

export const removeLink = ({ applicationId }: { applicationId: string }): RemoveLinkAction => ({
  type: REMOVE_LINK,
  applicationId,
});

export const displayBanner = (display: boolean): DisplayBannerAction => ({
  type: DISPLAY_BANNER,
  display,
});

export const displayRemoveLinkBanner = (display: boolean): DisplayRemoveLinkBannerAction => ({
  type: DISPLAY_REMOVE_LINK_BANNER,
  display,
});

export const loadCredentials = (load: boolean): LoadCredentialsAction => ({
  type: LOAD_CREDENTIALS,
  load,
});

export const closeAll = (): CloseAllAction => ({
  type: CLOSE_ALL,
});

// Reducers
export function passwordManagersReducers(state: Immutable.Map<string, any> = Immutable.Map(), action: PasswordManagersActions) {
  switch (action.type) {
    case ADD_PASSWORD_MANAGER: {
      const {
        step,
        provider,
        payload,
      } = action;

      if (step === ConfigurationStep.Exit) {
        return state.delete('configuration');
      }

      if (step === ConfigurationStep.Save) {
        const passwordManagerId = payload[Providers[provider.id].idKey];
        delete payload[Providers[provider.id].masterPasswordKey];

        return state
          .setIn([provider.id, passwordManagerId], Immutable.fromJS(payload))
          .set('configuration', Immutable.fromJS({
            provider,
            step: ConfigurationStep.Saved,
          }));
      }

      return state.set('configuration', Immutable.fromJS({
        provider,
        step,
        payload,
      }));
    }
    case REMOVE_PASSWORD_MANAGER: {
      const {
        passwordManager,
      } = action;

      return state.deleteIn([passwordManager.providerId, passwordManager.id]);
    }
    case UNLOCK: {
      const {
        step,
        passwordManager,
        webcontentsId,
        payload,
      } = action;

      if (step === UnlockStep.Exit) {
        return state.delete('unlock');
      }

      return state.set('unlock', Immutable.fromJS({
        step,
        passwordManager,
        webcontentsId,
        payload,
      }));
    }
    case LOAD_ACCOUNTS: {
      const {
        step,
        passwordManager,
        data,
      } = action;

      if (step === AccountsStep.Unload) {
        return state.delete('accounts');
      }

      return state.set('accounts', Immutable.fromJS({
        step,
        passwordManager,
        data,
      }));
    }
    case DISPLAY_BANNER: {
      return state.set('displayBanner', action.display);
    }
    case DISPLAY_REMOVE_LINK_BANNER: {
      return state.set('displayRemoveLinkBanner', action.display);
    }
    case LOAD_CREDENTIALS: {
      return state.set('loadingCredentials', action.load);
    }
    default:
      return state;
  }
}

export function passwordManagerLinksReducer(state: Immutable.Map<string, any> = Immutable.Map(), action: PasswordManagersActions) {
  switch (action.type) {
    case ADD_LINK: {
      const {
        passwordManager,
        applicationId,
        passwordManagerItemId,
        login,
        avatar,
      } = action;

      return state.set(applicationId, Immutable.fromJS({
        providerId: passwordManager.providerId,
        passwordManagerId: passwordManager.id,
        applicationId,
        passwordManagerItemId,
        login,
        avatar,
      }));
    }
    case REMOVE_LINK: {
      const { applicationId } = action;

      return state.delete(applicationId);
    }
    default:
      return state;
  }
}
