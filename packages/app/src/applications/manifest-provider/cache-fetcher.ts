import * as fs from 'fs-extra';
import * as moment from 'moment';
import {
  IFetcher,
  ManifestURL,
  Source,
} from './types';

export default class CacheFetcher implements IFetcher {
  private mutex: Map<ManifestURL, Promise<any>>;

  constructor() {
    this.mutex = new Map();
  }

  async fetch(uri: string) {
    // If fetching is already ongoing, wait for this result
    if (this.mutex.has(uri)) {
      return this.mutex.get(uri);
    }

    // Build the fetching promise
    const promisedApp = new Promise(async (resolve) => {
      try {
        const lastModified = await fs.stat(uri).then(stats => stats.ctime);
        const manifest = await fs.readJSON(uri);

        const app = {
          manifest,
          lastChecked: moment(lastModified),
          source: Source.CACHE,
        };

        this.mutex.delete(uri);
        resolve(app);
      } catch (err) {
        console.warn(err);
        this.mutex.delete(uri);
        resolve(undefined);
      }
    });

    // Set the mutex with the current promise
    this.mutex.set(uri, promisedApp);

    return promisedApp;
  }
}
