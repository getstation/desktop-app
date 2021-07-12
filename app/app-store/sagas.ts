import { remote } from 'electron';
import * as isBlank from 'is-blank';
import * as _ from 'lodash';
import { delay, SagaIterator } from 'redux-saga';
import { all, call, getContext, put, race, select } from 'redux-saga/effects';
import {
  getBxAppManifestURL,
  listAllApplications,
  listMostPopularApplications,
  Manifest,
  manifestToMinimalApplication,
  search,
} from '../../manifests';
import { getPrivateManifests, saveNewApplication } from '../../manifests/private';
import { BrowserXAppWorker } from '../app-worker';
import { changeSelectedApp } from '../applications/duck';
import { getApplicationManifestURL } from '../applications/get';
import { MinimalApplication } from '../applications/graphql/withApplications';
import { SLACK_STATION_NEXT_MANIFEST_URL } from '../applications/manifest-provider/const';
import { installApplication, InstallApplicationReturn } from '../applications/sagas/lifecycle';
import { InstallContext } from '../applications/types';
import { changeSelectedAppMain } from '../nav/duck';
import { getPreviousActiveApplicationId } from '../nav/selectors';
import { APPLICATION_INSTALLED_TOPIC, ApplicationInstalledPayload } from '../pubsub/topics';
import sdk from '../sdk/default-client';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { takeEveryWitness } from '../utils/sagas';
import { SHOW_APP_STORE, showAppStore, ShowAppStoreAction, TOGGLE_VISIBILITY } from './duck';
import { getAppStoreApplication, hasAlreadyApplicationsForManifest, isVisible } from './selectors';

const APP_STORE_MANIFEST_URL = process.env.APP_STORE_MANIFEST_URL!;

function* sagaShowAppStore(action: ShowAppStoreAction): SagaIterator {
  if (action.visible) {
    const appStoreApp = yield select(getAppStoreApplication);
    const appStoreApplicationId = appStoreApp.get('applicationId');
    const appStoreTabId = appStoreApp.get('activeTab');

    const manifestURL = getApplicationManifestURL(appStoreApp);
    sdk.activity.push(appStoreTabId, {}, 'nav-to-tab', manifestURL);

    yield put(changeSelectedAppMain(appStoreApplicationId));
  } else {
    const previousApplicationId = yield select(getPreviousActiveApplicationId);
    yield put(changeSelectedAppMain(previousApplicationId));
  }
}

function* toggleVisibility(): SagaIterator {
  const isPaneVisible = yield select(isVisible);
  yield put(showAppStore(!isPaneVisible));
}

export function* addApplicationRequest(
  manifestURL: string,
  context: InstallContext | undefined,
  inBackground: boolean = false
): SagaIterator {
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');
  const { pubsub } = bxApp;

  if (isBlank(manifestURL)) {
    throw new Error('Add Application : given manifest URL is blank');
  }

  const normalizedManifestURL = (new URL(manifestURL)).toString();

  const { installation, timeout }: { installation: InstallApplicationReturn, timeout: any } = yield race({
    installation: call(installApplication, normalizedManifestURL, { installContext: context }),
    timeout: call(delay, 2000),
  });

  if (timeout) {
    throw new Error('Application installation timeout');
  }

  if (!inBackground) {
    // @ts-ignore thunk
    yield put.resolve(changeSelectedApp(installation.applicationId, 'app-installation'));
  }

  // pubsub
  const payload: ApplicationInstalledPayload = {
    applicationId: installation.applicationId,
    inBackground: inBackground,
  };
  pubsub.publish(APPLICATION_INSTALLED_TOPIC, payload);

  return installation.applicationId;
}

/**
 * If we haven't installed the AppStore, let's do it.
 *
 * Will be called once Station launches.
 */
function* installAppStoreApplicationIfNotPresent(): SagaIterator {
  const appStoreAlreadyInstalled: boolean = yield select(hasAlreadyApplicationsForManifest, APP_STORE_MANIFEST_URL);
  if (!appStoreAlreadyInstalled) {
    yield call(installApplication, APP_STORE_MANIFEST_URL);
  }
}

/**
 * If we haven't installed the Slack for Station Next and we are on Next, let's install it.
 *
 * Will be called once Station launches.
 */
function* installSlackStationNextIfNextAndNotPresent(): SagaIterator {
  const appName = remote.app.name;
  if (appName !== 'Station Next') return;

  const nextSlackAlreadyInstalled: boolean = yield select(hasAlreadyApplicationsForManifest, SLACK_STATION_NEXT_MANIFEST_URL);
  if (!nextSlackAlreadyInstalled) {
    yield call(installApplication, SLACK_STATION_NEXT_MANIFEST_URL);
  }
}

export function* searchApplication(query: string): SagaIterator {
  return search(query);
}

export function* getMostPopularApplications(): SagaIterator {
  return listMostPopularApplications();
}

/**
 ************** Categories ******************
 */

const specialCategoriesForList = ['My Private Apps', 'Company Apps', 'Miscellaneous'];

const retrieveAllCategories = (apps: Manifest[]): string[] => {
  const categories: Record<string, true> = {};

  apps.forEach(({ category }) => {
    if (category) {
      categories[category] = true;
    }
  });

  return Object.keys(categories);
};

const sortAllCategories = (categories: string[]): string[] => {
  if (categories.length) {
    const sortedCategories = categories
    .filter(category => !_.some(specialCategoriesForList, item => item === category))
    .sort();

    sortedCategories.push('Miscellaneous');
    return sortedCategories;
  }
  return [];
};

export function* getAllCategories(): SagaIterator {
  const apps = listAllApplications();
  const categories = retrieveAllCategories(apps);

  return sortAllCategories(categories);
}

export function* getApplicationsByCategory(): SagaIterator {
  const appsByCategory: Record<string, MinimalApplication[]> = {};

  listAllApplications().forEach(app => {
    if (app.category) {
      if (!appsByCategory[app.category]) {
        appsByCategory[app.category] = [];
      }
      const minimalApp = manifestToMinimalApplication(app);
      appsByCategory[app.category].push(minimalApp);
    }
  });

  // Sort apps in their respective categories
  for (const cat in appsByCategory) {
    appsByCategory[cat] = appsByCategory[cat].sort((a, b) => a.name.localeCompare(b.name));
  }

  return appsByCategory;
}

/**
 * Creates a manifest in data folder
 */
export function* requestPrivateApplication(
  name: string,
  themeColor: string,
  bxIconURL: string,
  startURL: string,
  scope: string
): SagaIterator {
  const payload = {
    name,
    themeColor,
    bxIconURL,
    startURL,
    scope,
  };
  const id = saveNewApplication(payload);
  return { id, bxAppManifestURL: getBxAppManifestURL(id) };
}

export function* getPrivateApplications(): SagaIterator {
  return getPrivateManifests();
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(TOGGLE_VISIBILITY, toggleVisibility),
    takeEveryWitness(SHOW_APP_STORE, sagaShowAppStore),
    takeEveryWitness(REHYDRATION_COMPLETE, installAppStoreApplicationIfNotPresent),
    takeEveryWitness(REHYDRATION_COMPLETE, installSlackStationNextIfNextAndNotPresent),
  ]);
}
