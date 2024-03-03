import * as fs from 'fs-extra';
import * as moment from 'moment';
import {
  IFetcher,
  ManifestURL,
  Source,
  IDistantFetcherConfig,
} from './types';
import { getApplicationById } from '../../../manifests';

// ---- FETCH STRATEGIES

/**
 * Back when Station was a connected app, we used to fetch manifests from a remote API, hence the default
 * strategy was an outbound request (type Request / Response). See commented `defaultFetcher` below.
 *
 * Now that Station is a disconnected app, we store the manifests locally and load/fetch them in memory (or something)
 * and simply read them with the `localFetcher`.
 *
 * We left the configuration capabilities if you wish to overload, or you can simply remove the `localFetcher` and go back to
 * a different (remote) strategy.
 */

// Use native global.fetch as a default configuration for fetch if availabe, if not, use node-fetch (for testing purpose)
// @ts-ignore global.fetch is not recognized, depending on where we are
// const fetch = (global.fetch) ? global.fetch.bind(global) : require('node-fetch');

// Strategy used when Station was connected
// async function defaultFetcher(url: string) { return fetch(url).then((res: Response) => res.json()); }

async function localFetcher(url: string) {
  const splitted = url.split('://');
  const appId = splitted[splitted.length - 1];
  return getApplicationById(appId);
}

// ---- IMPLEMENTATION

export default class DistantFetcher implements IFetcher {
  private mutex: Map<ManifestURL, Promise<any>>;
  private fetcher: IDistantFetcherConfig['fetcher'];

  constructor(config?: IDistantFetcherConfig) {
    this.mutex = new Map();
    this.fetcher = (config?.fetcher) ? config.fetcher : localFetcher;
  }

  async fetch(url: ManifestURL) {
    // If fetching is already ongoing, wait for this result
    if (this.mutex.has(url)) {
      return this.mutex.get(url);
    }

    // Build the fetching promise
    const promisedApp = new Promise(async (resolve, reject) => {
      try {
        const manifest = (url.startsWith('file://'))
          ? await fs.readJSON(url.substring(7))
          : await this.fetcher(url);

        const app = {
          manifest,
          lastChecked: moment(),
          source: Source.DISTANT,
        };

        this.mutex.delete(url);
        resolve(app);
      } catch (err) {
        this.mutex.delete(url);
        console.error(err);
        reject(err);
      }
    });

    // Set the mutex with the current promise
    this.mutex.set(url, promisedApp);

    return promisedApp;
  }
}
