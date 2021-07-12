import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import { ApplicationSettingsImmutable } from './types';

export const isAlwaysLoaded = (manifest: BxAppManifest, appSettings?: ApplicationSettingsImmutable): boolean => {
  if (appSettings && appSettings.has('alwaysLoaded')) {
    return appSettings.get('alwaysLoaded');
  }
  return Boolean(manifest.bx_keep_always_loaded);
};
