import log from 'electron-log';
import { SagaIterator } from 'redux-saga';
import { all, call, getContext, put, select } from 'redux-saga/effects';
import * as shortid from 'shortid';
import { BrowserXAppWorker } from '../../app-worker';
import { MAIN_APP_READY } from '../../app/duck';
import { getApplicationsSettings } from '../../application-settings/selectors';
import { getAllManifests } from '../../applications/api';
import { BxAppManifest } from '../../applications/manifest-provider/bxAppManifest';
import { getInstalledManifestURLs } from '../../applications/selectors';
import { newNotification, showNotification } from '../../notification-center/duck';
import { setSleepNotification } from '../../onboarding/duck';
import { getSleepNotification } from '../../onboarding/selectors';
import { getIconPath } from '../../static/helpers';
import { updateLastPutToSleepAt } from '../../tabs/duck';
import { getTabs } from '../../tabs/selectors';
import { StationState } from '../../types';
import { STATION_CHECK_INACTIVE_TAB_EVERY_MS } from '../../utils/constants';
import { periodicTick, takeEveryWitness, takeLatestWitness } from '../../utils/sagas';
import { getWindowCurrentTabId } from '../../windows/get';
import { getWindows } from '../../windows/selectors';
import { tabWebcontentsToKill } from '../api';
import { removeWebcontents } from '../duck';
import { getTabWebcontents } from '../selectors';

function* checkSleepyTabs(): SagaIterator {
  log.debug('Checking sleepy tabs');
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');

  const tabWebcontents = yield select(getTabWebcontents);
  const appSettings = yield select(getApplicationsSettings);
  const tabs = yield select(getTabs);
  const windows = yield select(getWindows);
  const currentlyVisibleTabIds = windows.map(getWindowCurrentTabId).toArray();
  const applications = yield select((state: StationState) => state.get('applications'));

  const manifestURLs = yield select(getInstalledManifestURLs);
  const manifests: Map<string, BxAppManifest> = yield call(getAllManifests, bxApp, manifestURLs);

  const mountedTabsToKill = tabWebcontentsToKill(applications, appSettings, tabWebcontents, manifests, tabs, currentlyVisibleTabIds);

  // @ts-ignore Fixed with Immutable 4 https://github.com/facebook/immutable-js/issues/1183
  for (const [tabId] of mountedTabsToKill.valueSeq()) {
    log.debug('Putting to sleep', tabId);
    yield put(updateLastPutToSleepAt(tabId, Date.now()));
    yield put(removeWebcontents(tabId));
  }

  const sleepNotif = yield select(getSleepNotification);

  if (!sleepNotif && mountedTabsToKill.size > 0) {
    const notificationId = `notif/${shortid.generate()}`;
    const wording = mountedTabsToKill.size > 1 ? `${mountedTabsToKill.size} unused apps` : `an unused app`;
    const props = {
      title: 'Station',
      body: `We have put in sleep ${wording} so that your battery is safe, but they'll be available next time you use them.
             We'll keep saving your battery in the future without disturbing you`,
      icon: getIconPath(),
    };
    const options = {
      full: true,
    };
    yield put(newNotification(undefined, undefined, notificationId, props, options));
    yield put(showNotification(notificationId));
    yield put(setSleepNotification(Date.now()));
  }
}

export default function* main() {
  yield all([
    takeLatestWitness(MAIN_APP_READY, function* () {
      const tickChannel = yield call(periodicTick, STATION_CHECK_INACTIVE_TAB_EVERY_MS);
      yield takeEveryWitness(tickChannel, checkSleepyTabs);
    }),
  ]);
}
