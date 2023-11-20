import { SagaIterator } from 'redux-saga';
import { all, put } from 'redux-saga/effects';

import {
  markApplicationsWithManifestAsInstallable,
} from '../application-settings/duck';
import { navigateToApplicationTab } from '../applications/duck';

import { takeEveryWitness } from '../utils/sagas';

import { CLICK_DIALOG, ClickDialogAction } from './duck';

function* onClickDialog(action: ClickDialogAction): SagaIterator {
  const {
    dialog: { application, tab: { tabId } },
    buttonClicked: { onClick },
  } = action;

  switch (onClick) {
    case 'open-tab':
      yield put(navigateToApplicationTab(application.applicationId, tabId) as any);
      break;
    case 'install-application-confirm':
      yield put(markApplicationsWithManifestAsInstallable(application.manifestURL, false));
      break;
    case 'install-application-blacklist':
      yield put(markApplicationsWithManifestAsInstallable(application.manifestURL, true));
      break;
  }
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(CLICK_DIALOG, onClickDialog),
  ]);
}
