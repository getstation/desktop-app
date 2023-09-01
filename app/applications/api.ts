import ms = require('ms');
import { take } from 'rxjs/operators';
import * as BluebirdPromise from 'bluebird';
import { BxAppManifest } from './manifest-provider/bxAppManifest';
import { BrowserXAppWorker } from '../app-worker';
import ManifestProvider from './manifest-provider/manifest-provider';
import { IManifestProvider } from './manifest-provider/types';

const isManifestProvider = (provider: BrowserXAppWorker | IManifestProvider): provider is IManifestProvider => {
  return provider instanceof ManifestProvider;
};

/**
 * Will try to get the manifest with `appWorker.manifestProvider` in a resonable time.
 * @param appWorker | manifestProvider
 * @param manifestURL
 */
export async function getManifestOrTimeout(appWorker: BrowserXAppWorker | IManifestProvider, manifestURL: string): Promise<BxAppManifest> {
  let manifestProvider: IManifestProvider;
  if (isManifestProvider(appWorker)) {
    manifestProvider = appWorker;
  } else {
    manifestProvider = appWorker.manifestProvider;
  }
  if (!manifestProvider) throw new Error('manifestProvider not present');

  const $firstManifest = manifestProvider.get(manifestURL).pipe(take(1));

  const manifest = await BluebirdPromise.resolve(
    $firstManifest.toPromise()
  ).timeout(ms('30sec'), 'Could not get the manifest');

  return manifest.manifest;
}

export async function getAllManifests(appWorker: BrowserXAppWorker | ManifestProvider, manifestURLs: string[]):
  Promise<Map<string, BxAppManifest>> {
  const manifests = await BluebirdPromise.map(manifestURLs, async manifestURL => {
    const manifest = await getManifestOrTimeout(appWorker, manifestURL);
    return [manifestURL, manifest] as [string, BxAppManifest];
  });
  return new Map(manifests);
}
