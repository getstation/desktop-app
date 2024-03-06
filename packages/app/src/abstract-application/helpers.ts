import { oc } from 'ts-optchain';
import { MultiInstanceConfigPreset } from '../applications/manifest-provider/types';
import { format } from '../utils/handlebars';
import { getEmail } from '../user-identities/get';
import { getIdentityById } from '../user-identities/selectors';
import {
  getApplicationIdentityId,
  getApplicationSubdomain,
  getApplicationCustomURL,
} from '../applications/get';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import { ApplicationImmutable } from '../applications/types';
import { StationState } from '../types';
import { isMultiInstanceConfigurator, getPresets } from '../applications/manifest-provider/helpers';

const hasSubdomain = (presets: MultiInstanceConfigPreset[]) => presets.includes(MultiInstanceConfigPreset.Subdomain);
const hasGoogleAccount = (presets: MultiInstanceConfigPreset[]) => presets.includes(MultiInstanceConfigPreset.GoogleAccount);
const hasOnPremise = (presets: MultiInstanceConfigPreset[]) => presets.includes(MultiInstanceConfigPreset.OnPremise);

const isConfigurationRequiredForGoogleAccount = (application: ApplicationImmutable, presets: MultiInstanceConfigPreset[]) => {
  if (hasGoogleAccount(presets)) {
    return !getApplicationIdentityId(application);
  }
  return null;
};

const isConfigurationRequiredForSubdomain = (application: ApplicationImmutable, presets: MultiInstanceConfigPreset[]) => {
  if (hasSubdomain(presets) && hasOnPremise(presets)) { // on-premise + subdomain
    return !getApplicationSubdomain(application) && !getApplicationCustomURL(application);
  }
  if (hasSubdomain(presets) && !hasOnPremise(presets)) { // subdomain without on-premise
    return !getApplicationSubdomain(application);
  }
  return null;
};

const isConfigurationRequiredForOnPremise = (
  application: ApplicationImmutable,
  presets: MultiInstanceConfigPreset[],
  homeTabUrl: string,
) => {
  if (!hasSubdomain(presets) && hasOnPremise(presets)) {
    const customURL = getApplicationCustomURL(application);
    const configured = Boolean(customURL || !isMultiInstanceConfigurator(homeTabUrl));
    return !configured;
  }
  return null;
};

export const isConfigurationRequired = (
  manifest: BxAppManifest,
  application: ApplicationImmutable,
  homeTabUrl: string,
) => {
  const presets = getPresets(manifest);

  if (!presets.length) {
    return false;
  }

  const needConfigurations = [
    isConfigurationRequiredForGoogleAccount(application, presets),
    isConfigurationRequiredForSubdomain(application, presets),
    isConfigurationRequiredForOnPremise(application, presets, homeTabUrl),
  ].filter(x => x !== null);

  if (needConfigurations.length === 0) {
    throw Error('Missing MultiInstanceConfigPreset handler for isConfigurationRequired');
  }

  return needConfigurations.includes(true);
};

export const label = (
  state: StationState,
  manifest: BxAppManifest,
  application: ApplicationImmutable
) => {
  const { name, bx_multi_instance_config } = manifest;

  const presets = getPresets(manifest);

  if (!presets.length) {
    return name;
  }

  if (hasGoogleAccount(presets)) {
    const identity = getIdentityById(
      state,
      getApplicationIdentityId(application)
    );

    if (identity) {
      return format(
        bx_multi_instance_config!.instance_label_tpl,
        { email: getEmail(identity) }
      );
    }
  }

  if (hasSubdomain(presets)) {
    const subdomain = getApplicationSubdomain(application);

    if (subdomain) {
      return format(
        bx_multi_instance_config!.instance_label_tpl,
        { subdomain }
      );
    }
  }

  return name; // on-premise + normal flow
};

export const applicationLabel = (
  state: StationState,
  manifest: BxAppManifest,
  application: ApplicationImmutable
) => {
  const labels = [manifest.name];

  const instanceLabel = label(state, manifest, application);
  if (instanceLabel) labels.push(instanceLabel);

  return labels.join(' - ');
};

export const getChromeExtensionId = (manifest: BxAppManifest) => {
  if (manifest.import) {
    const potentialRecord = manifest.import
      .find((i: any) => i.platform === 'chrome');

    if (potentialRecord) {
      return potentialRecord.id;
    }

    return undefined;
  }

  return undefined;
};
