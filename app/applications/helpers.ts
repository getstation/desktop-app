import * as memoize from 'memoizee';
import { BxAppManifest } from './manifest-provider/bxAppManifest';
import { MultiInstanceConfigPreset } from './manifest-provider/types';

// handlebars takes some time to load, so we lazy load it
const getHandlebarsCompile = memoize(() => {
  const Handlebars = require('handlebars');
  return memoize(Handlebars.compile);
});

export type ConfigData = {
  identityId?: string,
  subdomain?: string,
  customURL?: string,
};

export const formatStartUrl = (manifest: BxAppManifest, configData: ConfigData): string =>
  formatURL(URLType.START, manifest, configData);

/**
 * Given a manifest and config, will form the URL to open a new page, using `new_page_url_tpl`
 * or by falling back on `start_url_tpl`;
 */
export const formatNewPageUrl = (manifest: BxAppManifest, configData: ConfigData): string =>
  formatURL(URLType.NEW_PAGE, manifest, configData);

enum URLType {
  NEW_PAGE,
  START,
}
/**
 * Factorized version of `formatStartUrl` and `formatNewPageUrl`.
 */
const formatURL = (urlType: URLType, manifest: BxAppManifest, configData: ConfigData): string => {
  const { bx_multi_instance_config } = manifest;
  if (!bx_multi_instance_config) throw new Error('Manifest should have a `bx_multi_instance_config` field');
  const presets = bx_multi_instance_config.presets;

  if (presets && presets.includes(MultiInstanceConfigPreset.OnPremise) && configData.customURL) {
    return configData.customURL;
  }
  const urlTpl = urlType === URLType.NEW_PAGE ?
    bx_multi_instance_config.new_page_url_tpl || bx_multi_instance_config.start_url_tpl :
    bx_multi_instance_config.start_url_tpl;

  return getHandlebarsCompile()(urlTpl)(configData);
};

export const interpretedIconUrl = (manifest: BxAppManifest) => {
  // FIXME: Should we update the `BxAppManifest` or ignore this ?
  return manifest.icon;
};
