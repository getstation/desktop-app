import { SagaIterator } from 'redux-saga';
import { all, call, put, select, take } from 'redux-saga/effects';
import { logger } from '../api/logger';
import { getFocusedTabId } from '../app/selectors';
import { FRONT_ACTIVE_TAB_CHANGE } from '../tab-webcontents/duck';
import { getWebcontentsIdForTabId } from '../tab-webcontents/selectors';
import { callService, takeEveryWitness } from '../utils/sagas';
import { getApplicationById } from '../applications/selectors';
import { getApplicationManifestURL } from '../applications/get';
import {
  accounts,
  AccountsStep,
  ADD_LINK,
  ADD_PASSWORD_MANAGER,
  addLink,
  addPasswordManager,
  CLOSE_ALL,
  ConfigurationStep,
  displayBanner,
  displayRemoveLinkBanner,
  LOAD_ACCOUNTS,
  loadCredentials,
  REMOVE_LINK,
  REMOVE_PASSWORD_MANAGER,
  removeLink,
  RemovePasswordManagerAction,
  UNLOCK,
  unlock,
  UnlockStep,
} from './duck';
import Providers from './providers';
import {
  getAccounts,
  getConfigurationProcess,
  getLinkForActiveApplication,
  getLinks,
  getPasswordManager,
  getProviderId,
  getProviderJS,
  getUnlockProcess,
} from './selectors';

const autoSubmits = new Map();

const canAutoSubmit = (webcontentsId: number) => {
  if (autoSubmits.has(webcontentsId)) {
    return false;
  }
  autoSubmits.set(webcontentsId, Date.now());
  return true;
};

const currentlySendLoginToWebContents = new Map();

export const canSendLoginToWebContents = (webcontentsId: number) => {
  if (currentlySendLoginToWebContents.has(webcontentsId)) {
    return false;
  }
  return true;
};

export function* getCredentialsForWebContents(webContentsId: number): SagaIterator {
  currentlySendLoginToWebContents.set(webContentsId, Date.now());
  const providerId = yield select(getProviderId);
  const runtime = Providers[providerId].runtime;
  const link = yield select(getLinkForActiveApplication);

  if (link) {
    const passwordManager = yield select(getPasswordManager);
    const applicationId = link.get('applicationId');

    const application = yield select(getApplicationById, applicationId);
    const manifestURL = getApplicationManifestURL(application);

    if (runtime.hasValidSession()) {
      try {
        yield put(loadCredentials(true));
        const passwordManagerItemId = link.get('passwordManagerItemId');
        const credentials = yield call([runtime, runtime.getAccountById], passwordManagerItemId);
        yield put(addLink({
          passwordManager,
          applicationId,
          passwordManagerItemId,
          login: credentials.username,
          avatar: credentials.avatar,
        }));
        return { account: credentials, canAutoSubmit: canAutoSubmit(webContentsId) };
      } catch (error) {
        yield put(removeLink({ applicationId }));
        const opts = {
          step: AccountsStep.Load,
          passwordManager,
        };

        yield put(accounts(opts));
      } finally {
        yield put(loadCredentials(false));
      }
    } else {
      yield put(unlock({ step: UnlockStep.Ask, passwordManager, webcontentsId: webContentsId }));
    }
  } else {
    yield put(displayBanner(true));
  }
  currentlySendLoginToWebContents.delete(webContentsId);
  return { status: false };
}

function* unlockPasswordManagerFlow(): SagaIterator {
  const unlockProcess = yield select(getUnlockProcess);
  const { step, passwordManager, webcontentsId, payload } = unlockProcess;

  if (step === UnlockStep.NotAsked) return;

  const runtime = Providers[passwordManager.providerId].runtime;

  if (step === UnlockStep.Ask) {
    yield put(displayRemoveLinkBanner(false));

    if (runtime.hasValidSession()) {
      const opts = {
        ...unlockProcess,
        step: UnlockStep.Exit,
      };
      yield put(unlock(opts));
      if (webcontentsId && canSendLoginToWebContents(webcontentsId)) {
        yield callService('tabWebContents', 'askAutoLoginCredentials', webcontentsId);
      }
      return;
    }
  }

  if (step === UnlockStep.Test) {
    try {
      const credentials = { ...passwordManager, ...payload };
      // @ts-ignore: can't understand promise
      yield call([runtime, runtime.setSession], credentials);
      const opts = {
        ...unlockProcess,
        step: UnlockStep.Finish,
      };
      autoSubmits.clear();
      yield put(unlock(opts));
      if (webcontentsId && canSendLoginToWebContents(webcontentsId)) {
        yield callService('tabWebContents', 'askAutoLoginCredentials', webcontentsId);
      }
    } catch (error) {
      logger.notify(error);
      const opts = {
        ...unlockProcess,
        step: UnlockStep.Error,
        payload: 'Wrong master password',
      };
      yield put(unlock(opts));
    }
  }

  if (step === UnlockStep.Finish) {
    // do what you want before exiting the process
    const opts = {
      ...unlockProcess,
      step: UnlockStep.Exit,
    };
    yield put(unlock(opts));
  }

  if (step === UnlockStep.ExitFromAutofill) {
    yield put(displayRemoveLinkBanner(true));
    const opts = {
      ...unlockProcess,
      step: UnlockStep.Exit,
    };
    yield put(unlock(opts));
  }
}

function* loadAccountsFlow(): SagaIterator {
  const process = yield select(getAccounts);
  const { step, passwordManager } = process;

  if (step === AccountsStep.NotAsked) return;

  if (step === AccountsStep.WaitConfiguration) {
    const provider = yield select(getProviderJS);
    yield put(addPasswordManager({ step: ConfigurationStep.Credentials, provider }));
    return;
  }

  const runtime = Providers[passwordManager.providerId].runtime;

  if (step === AccountsStep.Ask) {
    yield put(displayBanner(false));

    if (!runtime.hasValidSession()) {
      yield put(unlock({
        step: UnlockStep.Ask,
        passwordManager,
      }));

      const endUnlock = yield take((action: any) => action.type === UNLOCK && [UnlockStep.Finish, UnlockStep.Exit].includes(action.step));

      const nextStep = endUnlock.step === UnlockStep.Exit ?
        AccountsStep.Unload : AccountsStep.Load;

      yield put(accounts({
        step: nextStep,
        passwordManager,
      }));
    } else {
      yield put(accounts({
        step: AccountsStep.Load,
        passwordManager,
      }));
    }
  }

  if (step === AccountsStep.Load) {
    try {
      const data = yield call([runtime, runtime.getAccounts]);

      yield put(accounts({
        step: AccountsStep.Loaded,
        passwordManager,
        data,
      }));
    } catch (e) {
      logger.notify(e);
    }
  }

  if (step === AccountsStep.Loaded) { }
}

function* addPasswordManagerFlow(): SagaIterator {
  const configuration = yield select(getConfigurationProcess);
  const { step, provider, payload } = configuration;

  if (step === ConfigurationStep.NotStarted) return;

  yield put(displayBanner(false));

  if (step === ConfigurationStep.Test) {
    const runtime = Providers[provider.id].runtime;
    // @ts-ignore: can't understand promise
    const isValid = yield call([runtime, runtime.isValidCredentials], payload);

    if (isValid) {
      yield put(addPasswordManager({
        step: ConfigurationStep.Save,
        provider,
        payload,
      }));
    } else {
      yield put(addPasswordManager({
        step: ConfigurationStep.Error,
        provider,
        payload: 'Wrong credentials. Please verify your login information.',
      }));
    }
  }

  if (step === ConfigurationStep.Cancel) {
    const accountsProcess = yield select(getAccounts);
    if (accountsProcess.step === AccountsStep.WaitConfiguration) {
      yield put(accounts({
        step: AccountsStep.Unload,
      }));
    }

    yield put(addPasswordManager({
      step: ConfigurationStep.Exit,
      provider,
    }));
  }

  if (step === ConfigurationStep.Saved) {
    // do what you want before exiting the process
    const accountsProcess = yield select(getAccounts);

    if (accountsProcess.step === AccountsStep.WaitConfiguration) {
      const passwordManager = yield select(getPasswordManager);
      const accountsOpts = { ...accountsProcess, passwordManager, step: AccountsStep.Load };
      yield put(accounts(accountsOpts));
      yield put(setVisibilityTeamApp(false));
    }

    yield put(addPasswordManager({
      step: ConfigurationStep.Exit,
      provider,
    }));
  }
}

function* onRemovePasswordManager(action: RemovePasswordManagerAction): SagaIterator {
  yield call(exitCurrentFlow);
  const { providerId, id } = action.passwordManager;
  const links = yield select(getLinks);

  const linksToRemove = Array.from(links.values())
    .filter((v: any) => v.get('providerId') === providerId && v.get('passwordManagerId') === id)
    .map((v: any) => v.get('applicationId'));

  yield all(linksToRemove.map(applicationId => put(removeLink({ applicationId }))));
}

function* addLinkFlow(): SagaIterator {
  const process = yield select(getAccounts);
  const { passwordManager } = process;
  const tabId = yield select(getFocusedTabId);
  const webContentsId = yield select(getWebcontentsIdForTabId, tabId);

  yield put(accounts({
    step: AccountsStep.Unload,
    passwordManager,
  }));

  if (canSendLoginToWebContents(webContentsId)) {
    yield callService('tabWebContents', 'askAutoLoginCredentials', webContentsId);
  }
}

function* removeLinkFlow(): SagaIterator {
  yield put(displayRemoveLinkBanner(false));
}

function* exitCurrentFlow(): SagaIterator {
  const configurationProcess = yield select(getConfigurationProcess);
  const { configurationStep, configurationProvider } = configurationProcess;

  const unlockProcess = yield select(getUnlockProcess);
  const { unlockStep, unlockPasswordManager } = unlockProcess;

  const accountProcess = yield select(getAccounts);
  const { accountStep, accountPasswordManager } = accountProcess;

  if (configurationStep !== ConfigurationStep.NotStarted) {
    yield put(addPasswordManager({
      step: ConfigurationStep.Exit,
      provider: configurationProvider,
    }));
  }

  if (unlockStep !== UnlockStep.NotAsked) {
    yield put(unlock({
      step: UnlockStep.Exit,
      passwordManager: unlockPasswordManager,
    }));
  }

  if (accountStep !== AccountsStep.NotAsked) {
    yield put(accounts({
      step: AccountsStep.Unload,
      passwordManager: accountPasswordManager,
    }));
  }

  yield put(displayBanner(false));
}

export default function* main() {
  yield all([
    takeEveryWitness(UNLOCK, unlockPasswordManagerFlow),
    takeEveryWitness(LOAD_ACCOUNTS, loadAccountsFlow),
    takeEveryWitness(ADD_PASSWORD_MANAGER, addPasswordManagerFlow),
    takeEveryWitness(REMOVE_PASSWORD_MANAGER, onRemovePasswordManager),
    takeEveryWitness(ADD_LINK, addLinkFlow),
    takeEveryWitness(REMOVE_LINK, removeLinkFlow),
    takeEveryWitness([CLOSE_ALL, FRONT_ACTIVE_TAB_CHANGE], exitCurrentFlow),
  ]);
}
