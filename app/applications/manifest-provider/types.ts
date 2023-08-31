import { Observable } from 'rxjs';
import { BxAppManifest } from './bxAppManifest';
import { Moment } from 'moment';

export type ManifestURL = string;

export enum MultiInstanceConfigPreset {
  Undefined = 'undefined',
  Subdomain = 'subdomain',
  GoogleAccount = 'google-account',
  OnPremise = 'on-premise',
}

export interface IBxApp {
  manifest: BxAppManifest;
  lastChecked: Moment;
  source: Source;
}

export enum Source {
  CACHE = 'cache',
  DISTANT = 'distant',
}

/**
 * PROVIDER
 */

export type ManifestStore = Map<ManifestURL, IBxApp>;

export interface IProviderConfiguration {
  cacheFetcher: IFetcher,
  distantFetcher: IFetcher,
  /**
   * In hour, duraction of cache.
   */
  cacheLimit: number,
  /**
   * Where the cached manifest files should be stored.
   */
  cachePath?: string,
}

export interface IManifestProvider {
  cacheFetcher: IFetcher;
  distantFetcher: IFetcher;
  cachePath?: string;
  cacheLimit: number;

  get(url: ManifestURL): Observable<IBxApp>;
  getFirstValue(url: ManifestURL): Promise<IBxApp>;
  update(url: ManifestURL): Promise<boolean>;
}

/**
 * FETCHER
 */

export interface IFetcher {
  fetch(uri: string): Promise<IBxApp>;
}

export interface IDistantFetcherConfig {
  fetcher(input: string): Promise<BxAppManifest>,
}
