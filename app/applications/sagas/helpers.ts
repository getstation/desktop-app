import { SagaIterator } from 'redux-saga';
import { select, call, getContext } from 'redux-saga/effects';
import { BrowserXAppWorker } from '../../app-worker';
import { applicationLabel } from '../../abstract-application/helpers';
import { getApplicationIdByTabId, getTabById } from '../../tabs/selectors';
import { ApplicationConfigData } from '../duck';
import { formatStartUrl, formatNewPageUrl } from '../helpers';
import { BxAppManifest, MultiInstanceConfig } from '../manifest-provider/bxAppManifest';
import { getPresets, isMultiInstanceConfigurator } from '../manifest-provider/helpers';
import { MultiInstanceConfigPreset } from '../manifest-provider/types';
import { getMultiInstanceConfiguratorURL } from '../multi-instance-configuration/helpers';
import { getApplicationById, getApplicationFullConfigData } from '../selectors';
import { getApplicationManifestURL, getApplicationActiveTab } from '../get';
import { getTabURL } from '../../tabs/get';
import { ApplicationImmutable } from '../types';
import { StationTabImmutable } from '../../tabs/types';
import { getActiveTabByApplicationId } from '../../app/selectors';

export function* getStartURL(
  manifest: BxAppManifest,
  manifestURL: string,
  applicationId: string,
  configData: ApplicationConfigData = {},
): SagaIterator {
  const manifestStartUrl = manifest.start_url!;
  const presets = getPresets(manifest);
  const { identityId, subdomain, customURL } = configData;

  if (!presets.length) return manifestStartUrl;

  const activeTab: StationTabImmutable | undefined = yield select(getActiveTabByApplicationId, applicationId);
  const activeTabUrl: string = activeTab && getTabURL(activeTab) || '';

  // normal flow = empty config data submitted when an app is configurable
  if (!identityId && !subdomain && !customURL && isMultiInstanceConfigurator(activeTabUrl)) {
    return manifestStartUrl;
  }

  // handle presets start url
  const startUrl = yield call(getStartURLForPreset, manifest, applicationId, presets, configData);

  // if no startUrl is computed, get multi instance configurator URL
  return startUrl || getMultiInstanceConfiguratorURL(manifestURL, applicationId);
}

/**
 * Will construct an URL used to Open a New Page.
 *
 * To do so, we preferably use `bx_new_page_url` member of the manifest,
 * or `new_page_url_tpl` in case of Multi-Instance.
 *
 * Otherwise we fallback on `start_url`, or `start_url_tpl` in case of Multi-Instance.
 */
export function* getNewPageURL(
  manifest: BxAppManifest,
  applicationId: string,
  configData: ApplicationConfigData = {},
): SagaIterator {
  const presets = getPresets(manifest);
  const isMultiInstance = presets.length > 0;
  if (isMultiInstance) {
    return yield call(getNewPageURLForPreset, manifest, applicationId, presets, configData);
  }
  return manifest.bx_new_page_url || manifest.start_url;
}

function* getStartURLForPreset(
  manifest: BxAppManifest,
  applicationId: string,
  presets: NonNullable<MultiInstanceConfig['presets']>,
  configData: ApplicationConfigData = {},
): SagaIterator {
  return yield call(getURLForPreset,
    URLType.START,
    manifest,
    applicationId,
    presets,
    configData);
}

/**
 * Will construct an URL used to Open a New Page in a multi-instance config case.
 */
function* getNewPageURLForPreset(
  manifest: BxAppManifest,
  applicationId: string,
  presets: NonNullable<MultiInstanceConfig['presets']>,
  configData: ApplicationConfigData = {},
): SagaIterator {
  return yield call(getURLForPreset,
    URLType.NEW_PAGE,
    manifest,
    applicationId,
    presets,
    configData);
}

enum URLType {
  START,
  NEW_PAGE,
}

/**
 * Will generate an URL of the type `URLType`.
 */
function* getURLForPreset(
  type: URLType,
  manifest: BxAppManifest,
  applicationId: string,
  presets: NonNullable<MultiInstanceConfig['presets']>,
  configData: ApplicationConfigData = {},
): SagaIterator {
  const { identityId, subdomain, customURL } = configData;

  if (identityId && presets.includes(MultiInstanceConfigPreset.GoogleAccount)) {
    const application = yield select(getApplicationById, applicationId);
    const fullConfigData = yield select(getApplicationFullConfigData, application, { identityId });
    // @ts-ignore sagas and TS does not seem to go well together
    return type === URLType.NEW_PAGE ? formatNewPageUrl(manifest, fullConfigData) : formatStartUrl(manifest, fullConfigData);
  } else if (subdomain && presets.includes(MultiInstanceConfigPreset.Subdomain)) {
    return type === URLType.NEW_PAGE ? formatNewPageUrl(manifest, { subdomain }) : formatStartUrl(manifest, { subdomain });
  } else if (customURL && presets.includes(MultiInstanceConfigPreset.OnPremise)) {
    return customURL;
  }

  return null;
}

export function* getApplicationInstanceLabelByApplicationId(applicationId: string): SagaIterator {
  const application = yield select(getApplicationById, applicationId);
  const manifest: BxAppManifest = yield call(getManifestByApplicationId, applicationId);

  return yield call(applicationLabel, yield select(), manifest, application);
}

export function* getManifestByApplicationId(applicationId: string): SagaIterator {
  const { manifestProvider }: BrowserXAppWorker = yield getContext('bxApp');

  const application = yield select(getApplicationById, applicationId);
  const manifestUrl = yield call(getApplicationManifestURL, application);
  const { manifest } = yield manifestProvider.getFirstValue(manifestUrl);

  return manifest;
}

export function* lookupApplicationIdWithDestination(obj?: any): SagaIterator {
  if (obj) {
    const { applicationId, tabId } = obj;

    if (applicationId) return applicationId;
    if (tabId) return yield select(getApplicationIdByTabId, tabId);

    return undefined;
  }

  return undefined;
}
