import { over, lensProp } from 'ramda';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import * as crypto from 'crypto';
import { join } from 'path';
import * as fs from 'fs-extra';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
import ms = require('ms');
import {
  IManifestProvider,
  ManifestURL,
  IFetcher,
  ManifestStore,
  IProviderConfiguration,
  IBxApp,
} from './types';
import DistantFetcher from './distant-fetcher';
import CacheFetcher from './cache-fetcher';
import { MultiInstanceConfig } from './bxAppManifest';

// allow bx to work with manifestV1 api
export const compatLegacyManifest = over(lensProp('bx_multi_instance_config'), (config: MultiInstanceConfig): MultiInstanceConfig => {
  if (config && config.preset && !config.presets) {
    return {
      ...config,
      presets: [config.preset],
    };
  }

  return config || {};
});

// Default configuration, with preset Fetcher & Interpreter
const defaultConfig: IProviderConfiguration = {
  distantFetcher: new DistantFetcher(),
  cacheFetcher: new CacheFetcher(),
  cacheLimit: ms('24h'),
};

/**
 * Expose an API to get remote (or local) manifests.
 *
 * Implements a caching system.
 */
export default class ManifestProvider implements IManifestProvider {
  cacheFetcher: IFetcher;
  distantFetcher: IFetcher;
  cachePath?: string;
  cacheLimit: number;

  private readonly store: BehaviorSubject<ManifestStore>;

  constructor(customConfig?: Partial<IProviderConfiguration>) {
    const config = { ...defaultConfig, ...customConfig };
    const {
      cacheFetcher,
      distantFetcher,
      cachePath,
      cacheLimit,
    } = config;

    // Register sub-modules
    this.cacheFetcher = cacheFetcher;
    this.distantFetcher = distantFetcher;

    // Init internal value
    this.cacheLimit = cacheLimit;
    this.cachePath = cachePath;

    // Start subject
    this.store = new BehaviorSubject<ManifestStore>(new Map());
  }

  diskCacheEnabled() : boolean {
    return !isBlank(this.cachePath);
  }

  // EXPOSED APIs

  /**
   * Will get the manifest with the given URL.
   *
   * Will return an Observable that will emit values representing the maifest.
   *
   * If the manifest is already in cache, it will emit immediately.
   * @param rawUrl
   */
  get(rawUrl: ManifestURL): Observable<IBxApp> {
    if (isBlank(rawUrl)) {
      throw new Error('Manifest Provider : no URL given to get');
    }

    const url = this.normalize(rawUrl);
    this.loadManifest(url);

    return this.storeObservable(url);
  }

   /**
    * If any, will get the manifest with the given URL directly from the cache.
    *
    * If the manifest is not in cache, `undefined` is returned.
    * @param rawUrl
    */
  getFromCache(rawUrl: ManifestURL): IBxApp | undefined {
    if (isBlank(rawUrl)) {
      throw new Error('Manifest Provider : no URL given to get');
    }

    const url = this.normalize(rawUrl);
    return this.store.value.get(url);
  }

  /**
  * Will get the manifest with the given URL.
  *
  * Will return a Promise that will represent the maifest.
  *
  * @param rawUrl
  */
  async getFirstValue(rawUrl: ManifestURL): Promise<IBxApp> {
    return this.get(rawUrl).pipe(first()).toPromise();
  }

  /**
   * Will try to remote update the manifest with the given URL.
   *
   * Will resovle true if it was successfull.
   * @param rawUrl
   */
  async update(rawUrl: ManifestURL) {
    if (isBlank(rawUrl)) {
      throw new Error('Manifest Provider : no URL given to get');
    }

    const url = this.normalize(rawUrl);
    return await this.fetchDistant(url);
  }

  // INTERNALS

  private storeObservable(url: ManifestURL): Observable<IBxApp> {
    return this.store.pipe(
      map(applications => applications.get(url)!),
      filter(bxApp => Boolean(bxApp)),
      distinctUntilChanged()
    );
  }

  private async loadManifest(url: ManifestURL) {
    // Check if the application is in cache and if it should be updated
    const hasLoaded = await this.fetchCache(url);
    const shouldUpdate = this.shouldUpdate(url);

    // If not available in cache or cache is too old
    if (!hasLoaded || shouldUpdate) {
      this.fetchDistant(url);
    }
  }

  private async fetchCache(url: ManifestURL): Promise<boolean> {
    const store = this.store.getValue();
    const loaded = store.get(url);

    // If not loaded from memory, check the cache
    if (!loaded) {
      if (!this.diskCacheEnabled()) {
        return false;
      }
      const uri = this.buildCacheURI(url);
      const cached = await this.cacheFetcher.fetch(uri);

      // If not in cache either, stop here
      if (!cached) {
        return false;
      }

      const bxApp = {
        ...cached,
        manifest: compatLegacyManifest(cached.manifest),
      };

      store.set(url, bxApp);
    }

    // Dispatch what has been found
    this.store.next(store);
    return true;
  }

  private async fetchDistant(url: ManifestURL) {
    const store = this.store.getValue();

    const fetched = await this.distantFetcher.fetch(url);

    if (!fetched) {
      return false;
    }

    const bxApp = {
      ...fetched,
      manifest: compatLegacyManifest(fetched.manifest),
    };

    this.saveToCache(url, bxApp);

    // Save it and dispatch
    store.set(url, bxApp);
    this.store.next(store);

    return true;
  }

  private shouldUpdate(url: ManifestURL) {
    if (!this.diskCacheEnabled()) {
      return false;
    }
    const loaded = this.store.getValue().get(url);
    if (!loaded) {
      return false;
    }

    // Check cache deprecation limit
    const cacheLimit = loaded.lastChecked.clone();
    cacheLimit.add(this.cacheLimit, 'ms');

    return moment().isAfter(cacheLimit);
  }

  private async saveToCache(url: ManifestURL, app: IBxApp) {
    if (!this.diskCacheEnabled()) {
      return;
    }
    const current = this.store.getValue().get(url);

    if (!current || app.lastChecked.isAfter(current.lastChecked)) {
      const uri = this.buildCacheURI(url);
      await fs.outputJSON(uri, app.manifest);
    }
  }

  /**
   * UTILS
   */

  // Normalize URL :
  // -> normalize("HTTP://ABC.com:80/%7Esmith/home.html") === "http://abc.com/%7Esmith/home.html
  private normalize(url: ManifestURL) {
    return (new URL(url)).toString();
  }

  private hasher(url: ManifestURL) {
    return crypto.createHash('md5').update(url).digest('hex');
  }

  private buildCacheURI(url: ManifestURL) {
    const filename = `${this.hasher(url)}.json`;
    return this.cachePath ? join(this.cachePath, filename) : '';
  }
}
