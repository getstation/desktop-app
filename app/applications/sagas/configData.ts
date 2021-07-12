import { SagaIterator } from 'redux-saga';
import { call, getContext, put, select } from 'redux-saga/effects';
import { BrowserXAppWorker } from '../../app-worker';
import { navigateTabToURL } from '../../tab-webcontents/duck';
import { getWebcontentsIdForTabId } from '../../tab-webcontents/selectors';
import { getImageURL } from '../../user-identities/get';
import { getIdentityById } from '../../user-identities/selectors';
import { callService } from '../../utils/sagas';
import { getManifestOrTimeout } from '../api';
import {
  SetConfigDataAction,
  updateApplicationIcon,
} from '../duck';
import { getApplicationActiveTab, getApplicationManifestURL } from '../get';
import { BxAppManifest } from '../manifest-provider/bxAppManifest';
import {
  getApplicationById,
} from '../selectors';
import { getStartURL } from './helpers';

export function* goToStartUrlAfterSetConfigData({ applicationId, configData }: SetConfigDataAction) {
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');
  const application = yield select(getApplicationById, applicationId);
  if (!application) return;

  const tabId = getApplicationActiveTab(application);
  if (!tabId) return;

  const manifestURL = getApplicationManifestURL(application);
  const manifest: BxAppManifest = yield call(getManifestOrTimeout, bxApp, manifestURL);

  const startUrl = yield call(getStartURL, manifest, manifestURL, applicationId, configData);
  yield put(navigateTabToURL(tabId, startUrl));

  const wcId = yield select(getWebcontentsIdForTabId, tabId);
  if (!wcId) return;

  // Disallow returning back to configuration page
  yield callService('tabWebContents', 'clearHistory', wcId);
}

export function* updateApplicationIconAfterSetConfigData({ applicationId, configData }: SetConfigDataAction): SagaIterator {
  if (!configData || !configData.identityId) return;
  const identity = yield select(getIdentityById, configData.identityId);
  const imageUrl = getImageURL(identity);
  if (imageUrl) {
    yield put(updateApplicationIcon(applicationId, imageUrl));
  }
}
