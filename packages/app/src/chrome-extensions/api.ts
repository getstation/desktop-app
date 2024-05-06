import * as BluebirdPromise from 'bluebird';
import { uniq } from 'ramda';
import { getManifestOrTimeout } from '../applications/api';
import { BrowserXAppWorker } from '../app-worker';

/**
 * Given a list of manifestURLs will return the Chrome extensionIs that are declared in
 * as `import` in the manifest.
 * @param appWorker
 * @param manifestURLs
 */
export async function getImportedCXIdsForManifests(appWorker: BrowserXAppWorker, manifestURLs: string[]): Promise<string[]> {
  const manifests = await BluebirdPromise.map(manifestURLs, manifestURL => {
    return getManifestOrTimeout(appWorker, manifestURL);
  });

  // extract the imported chrome extension from the manifests
  const extensionIds: string[] = [];
  for (const manifest of manifests) {
    if (manifest.import) {
      for (const externalResource of manifest.import) {
        if (externalResource.platform === 'chrome' && externalResource.id) {
          extensionIds.push(externalResource.id);
        }
      }
    }
  }

  return uniq(extensionIds);
}
