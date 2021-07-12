import { IconSymbol, Style } from '@getstation/theme';
import { SagaIterator } from 'redux-saga';
import { all, call, getContext, put, select } from 'redux-saga/effects';
import * as shortid from 'shortid';

import { getManifestOrTimeout } from '../applications/api';
import { dispatchUrl, uninstallApplication } from '../applications/duck';
import { getApplicationActiveTab } from '../applications/get';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import { getApplicationsWithManifest, getHomeTab } from '../applications/selectors';
import { ApplicationImmutable } from '../applications/types';
import { addItem } from '../dialogs/duck';
import { getTabId, getTabURL } from '../tabs/get';
import { getTabById } from '../tabs/selectors';
import { DEFAULT_BROWSER } from '../urlrouter/constants';
import { takeEveryWitness } from '../utils/sagas';
import {
  MarkApplicationsWithManifestAsInstallableAction,
  SET_INSTALLABLE,
} from './duck';

export function* optOutConfirmationFlow(applicationId: string, manifestURL: string): SagaIterator {
  const id = `dialog-${shortid.generate()}`;
  const tab = yield select(getHomeTab, applicationId);

  const bxApp = yield getContext('bxApp');
  const manifest: BxAppManifest = yield call(getManifestOrTimeout, bxApp, manifestURL);

  yield put(
    addItem({
      id,
      title: `We just added ${manifest.name} to your Station. Would you like to keep it there?`,
      message: 'You can always add it manually from the app store',
      tabId: getTabId(tab),
      actions: [
        {
          onClick: 'install-application-blacklist',
          icon: IconSymbol.CROSS,
          text: 'No, open in my browser',
          style: Style.LINK,
        },
        {
          onClick: 'install-application-confirm',
          icon: IconSymbol.CHECKMARK,
          text: 'Yes, awesome!',
          style: Style.SECONDARY,
        },
      ],
    })
  );
}

function* onInstallableApplication({ manifestURL, doNotInstall }: MarkApplicationsWithManifestAsInstallableAction): SagaIterator {
  if (doNotInstall) {
    const applications = yield select(getApplicationsWithManifest, manifestURL);

    const urlsToReopenInTheDefaultBrowser: (string | undefined)[] = [];

    yield all(applications.map((app: ApplicationImmutable) => call(function* () {
      const tabId = getApplicationActiveTab(app);
      const tab = yield select(getTabById, tabId);
      urlsToReopenInTheDefaultBrowser.push(getTabURL(tab));
      yield put(uninstallApplication(app.get('applicationId')));
    })).toArray());

    for (const url of urlsToReopenInTheDefaultBrowser) {
      if (url) {
        yield put(dispatchUrl(url, {}, { target: DEFAULT_BROWSER }));
      }
    }
  }
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(SET_INSTALLABLE, onInstallableApplication),
  ]);
}
