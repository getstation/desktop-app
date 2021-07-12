import { SagaIterator } from 'redux-saga';
import { all, call, getContext, put, select } from 'redux-saga/effects';
import { oc } from 'ts-optchain';
import { BrowserXAppWorker } from '../../app-worker';
import { addAppItem, removeAppItem } from '../../dock/duck';
import { deleteFavorite } from '../../favorites/duck';
import { getFavoritesForApplication } from '../../favorites/selectors';
import { removeLink } from '../../password-managers/duck';
import { closeAllTabsInApp } from '../../tabs/duck';
import { getTabFavoriteId } from '../../tabs/get';
import { takeEveryWitness } from '../../utils/sagas';
import { getManifestOrTimeout } from '../api';
import {
  ApplicationConfigData, changeSelectedApp,
  createApplication,
  createNewTab,
  dropApplication, INSTALL_APPLICATION, InstallApplicationAction,
  setConfigData,
  UNINSTALL_APPLICATION,
  UninstallApplicationAction,
} from '../duck';
import { BxAppManifest } from '../manifest-provider/bxAppManifest';
import { MultiInstanceConfigPreset } from '../manifest-provider/types';
import { getStartURL } from './helpers';
import { optOutConfirmationFlow } from '../../application-settings/sagas';
import { getPresets } from '../manifest-provider/helpers';
import { InstallContext } from '../types';

interface InstallApplicationOptions {
  installContext?: InstallContext,
  identityId?: string,
  subdomain?: string,
  customURL?: string,
}

export interface InstallApplicationReturn {
  applicationId: string,
  manifest: BxAppManifest,
}

function* setIdentityIfMultiInstanceApplication(
  applicationId: string,
  manifest: BxAppManifest,
  configData: ApplicationConfigData = {}
): SagaIterator {
  const { identityId, subdomain, customURL } = configData;
  const presets = getPresets(manifest);

  if (identityId && presets.includes(MultiInstanceConfigPreset.GoogleAccount)) {
    yield put(setConfigData(applicationId, { identityId }));
  } else if (subdomain && presets.includes(MultiInstanceConfigPreset.Subdomain)) {
    yield put(setConfigData(applicationId, { subdomain }));
  } else if (customURL && presets.includes(MultiInstanceConfigPreset.OnPremise)) {
    yield put(setConfigData(applicationId, { customURL }));
  }
}

/**
 * This sagas will install an application given its `manifestURL`.
 */
export function* installApplication(
  manifestURL: string,
  options?: InstallApplicationOptions,
): SagaIterator {
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');
  const manifest: BxAppManifest = yield call(getManifestOrTimeout, bxApp, manifestURL);

  // create the application entry in state
  const createAction = createApplication(manifestURL, oc(options).installContext());
  const { applicationId } = createAction;
  yield put(createAction);

  yield call(setIdentityIfMultiInstanceApplication, applicationId, manifest, options);

  // let's create the hometab for the application
  if (manifest.start_url) {
    const startURL = yield call(getStartURL, manifest, manifestURL, applicationId, options);
    yield put(createNewTab(applicationId, startURL, { home: true }));
  }

  // todo: if later in time the `bx_no_dock` changes for given manifest,
  // we won't be able to reflect change
  if (!manifest.bx_no_dock) {
    yield put(addAppItem(applicationId));
  }

  return {
    applicationId,
    manifest,
  } as InstallApplicationReturn;
}

/**
 * Uninstall the given application by `applicationId`
 * @param applicationId
 */
export function* uninstallApplication(applicationId: string): SagaIterator {
  yield put(closeAllTabsInApp(applicationId));
  yield put(dropApplication(applicationId));
  yield put(removeAppItem(applicationId));
  yield put(removeLink({ applicationId }));

  // todo move that behind a single action
  const applicationFavs = (yield select(getFavoritesForApplication, applicationId)).values();
  for (const fav of applicationFavs) {
    const favoriteId = getTabFavoriteId(fav);
    if (favoriteId) yield put(deleteFavorite(favoriteId));
  }
}

function* onInstallApplication(action: InstallApplicationAction) {
  const { applicationId }: InstallApplicationReturn = yield call(
    installApplication,
    action.manifestURL,
    {
      installContext: action.installContext,
    }
  );

  if (action.andCreateTabWithURL) {
    yield put(createNewTab(applicationId, action.andCreateTabWithURL, { navigateToApplication: true }));
  }

  if (action.navigate) {
    yield put(changeSelectedApp(applicationId, 'app-installation'));
  }

  if (action.optOutFlow) {
    yield call(optOutConfirmationFlow, applicationId, action.manifestURL);
  }
}

/**
 * Will answer to actions succh as:
 * - UNINSTALL_APPLICATION
 */
export function* watchLifecyleActions() {
  yield all([
    takeEveryWitness(UNINSTALL_APPLICATION, function* (action: UninstallApplicationAction) {
      yield call(uninstallApplication, action.applicationId);
    }),
    takeEveryWitness(INSTALL_APPLICATION, onInstallApplication),
  ]);
}
