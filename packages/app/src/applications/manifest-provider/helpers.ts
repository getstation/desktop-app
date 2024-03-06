import { MultiInstanceConfigPreset as Preset } from './types';
import { BxAppManifest } from './bxAppManifest';
import { oc } from 'ts-optchain';
import { BX_PROTOCOL } from '../../webui/const';

export const getPresets = (manifest?: BxAppManifest) => {
  return oc(manifest).bx_multi_instance_config.presets([]);
};

export const isOnlyOnPremise = (presets: Preset[]) => {
  return presets.length === 1 && presets[0] === Preset.OnPremise;
};

export const isMultiInstanceConfigurator = (url: string = '') => {
  return url.startsWith(`${BX_PROTOCOL}://multi-instance-configurator`);
};
