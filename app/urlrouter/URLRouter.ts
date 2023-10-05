// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
// @ts-ignore: no declaration file
import * as RadixRouter from 'radix-router';
import { uniq } from 'ramda';
import { BehaviorSubject } from 'rxjs';
import { URL as NodeURL } from 'url';
import { isNotInstallableApplication } from '../application-settings/selectors';
import { getApplicationId, getApplicationManifestURL, getApplicationCustomURL } from '../applications/get';
import ManifestProvider from '../applications/manifest-provider/manifest-provider';
import { getApplicationById, getApplications, getApplicationCustomURLsWithApplicationId } from '../applications/selectors';
import { ApplicationImmutable } from '../applications/types';
import { handleError } from '../services/api/helpers';
import { getTabIdMatchingURL } from '../tabs/selectors';
import { StationState, StationStore } from '../types';
import { DEFAULT_BROWSER, DEFAULT_BROWSER_BACKGROUND, NEW_TAB, NEW_WINDOW, Targets } from './constants';
import {
  ApplicationConnectionNode,
  ApplicationItem,
  ParsedURL,
  RoutingOrigin,
  URLRouterAction,
  URLRouterActionAndDestination,
} from './types';

const normalizeURL = (url:string): string => new NodeURL(url).toString();

/* TODO Next Steps
   - add `radix-router` typing
   - Use `radix-router` even for `isInScope` and `findInInstalledScopes`
     - For this, listen to `getApplications` updates and create a second `scopesRadix` for installed apps
     - We should not need `manifestProvider` anymore (dataRouter + getApplications should be enough)
   - `buildScopesRadix` should not create the full radix tree from scratch each time its updated
 */
export default class URLRouter {
  public dataRouter: BehaviorSubject<ApplicationItem[] | null>;
  private getState: StationStore['getState'];
  private manifestProvider: ManifestProvider;
  private scopesRadix: any;

  constructor(getState: StationStore['getState'], manifestProvider: ManifestProvider) {
    this.getState = getState;
    this.dataRouter = new BehaviorSubject(null);
    this.manifestProvider = manifestProvider;

    // Observe all potential app scopes and build a tree when it arrives
    this.dataRouter.subscribe((data) => {
      this.scopesRadix = this.buildScopesRadix(data);
    });
  }

  get state(): StationState {
    return this.getState();
  }

  public async routeURL(
    url: string,
    origin?: RoutingOrigin,
    options: { target?: Targets, forceCaptive?: boolean } = {}
  ): Promise<URLRouterActionAndDestination> {
    // Handy re-usable checks
    const newTab = options.target === NEW_TAB;
    const newWindow = options.target === NEW_WINDOW;
    const defaultBrowser = options.target === DEFAULT_BROWSER || options.target == DEFAULT_BROWSER_BACKGROUND;

    if (defaultBrowser) {
      return [URLRouterAction.DEFAULT_BROWSER, null];
    }

    try {
      // Station tabs
      const match = this.hasMatchingTab(url);
      if (match) {
        if (match.type === 'exact') {
          return (origin && origin.tabId === match.tabId)
            ? [URLRouterAction.RELOAD, { tabId: match.tabId }]
            : [URLRouterAction.NAV_TO_TAB, { tabId: match.tabId }];
        }
        return [URLRouterAction.PUSH_AND_NAV_TO_TAB, { tabId: match.tabId }];
      }

      // Scope
      if (origin && await this.isInScope(url, origin)) {
        // Decide where to open
        if (newTab) return [URLRouterAction.NEW_TAB, origin];
        if (newWindow) return [URLRouterAction.NEW_WINDOW, origin];
        return [URLRouterAction.NAV_IN_TAB, origin];
      }

      // Deeplink
      const application = await this.findApplicationInInstalledScopes(url);
      if (application) {
        const applicationId = getApplicationId(application);
        return (newWindow)
          ? [URLRouterAction.NEW_WINDOW, { applicationId }]
          : [URLRouterAction.NEW_TAB, { applicationId }];
      }

      // Others
      const manifestURL = this.findInAllScopes(url);
      if (manifestURL) {
        return [URLRouterAction.INSTALL_AND_OPEN, { manifestURL }];
      }

    } catch (err) {
      console.warn('URL Router : routing failed, redirecting to browser');
      handleError()(err);
    }

    // URL not handled by anyone
    return [URLRouterAction.DEFAULT_BROWSER, null];
  }

  // SCOPES

  /**
   * Checks if the given URL is covered by the scopes of the current app
   * (the one from which emanate the routing call).
   * @param url URL to check against the current scopes
   * @param origin Params describing the origin of the routing call
   */
  async isInScope(url: string, origin: RoutingOrigin = {}) {
    if (!origin.applicationId) return false;

    const app = getApplicationById(this.state, origin.applicationId);

    if (!app) return false;

    const scopes = await this.getScopes(app);
    return this.searchScopes(url, scopes);
  }

  /**
   * Search if the given URL is covered by any of the already installed app scopes in Station
   * and returns its ID if one is found.
   * @param url URL to check against all the installed scopes
   */
  async findApplicationInInstalledScopes(url: string): Promise<ApplicationImmutable | null> {
    const allApps: ApplicationImmutable[] = getApplications(this.state).toArray();
    const appsWithCustomUrls: ApplicationImmutable[] = allApps.filter(app => !!getApplicationCustomURL(app));
    const appsWithoutCustomUrls: ApplicationImmutable[] = allApps.filter(app => !getApplicationCustomURL(app));

    const apps = [...appsWithCustomUrls, ...appsWithoutCustomUrls];

    for (const app of apps) {
      const scopes = await this.getScopes(app);

      if (this.searchScopes(url, scopes)) return app;
    }

    return null;
  }

  /**
   * Search if the given url is covered by any of the available scopes in the GraphQL API (App Store)
   * and returns its manifestURL if one is found. It also checks if the user opted out to install this app.
   * @param url URL to check against all the available scopes
   */
  findInAllScopes(url: string) {
    const urlPath = this.toRadixPath(url);
    if (!urlPath) return null;

    const result = this.scopesRadix.lookup(urlPath);

    if (result) {
      const { manifestURL } = result.data;
      const optedOut = isNotInstallableApplication(this.state, manifestURL);

      if (!optedOut) return manifestURL;
    }

    return null;
  }

  // INTERNALS

  searchScopes(rawUrl: string, scopes: string[] | undefined) {
    if (!scopes || !rawUrl) return false;

    const url = this.parseUrl(rawUrl);
    if (!url) return false;

    // Search at least one scope that could match the url
    return scopes.some((rawScope: string) => {
      const scope = this.parseUrl(rawScope);
      if (!scope) return false;

      return this.matchScope(url, scope);
    });
  }

  buildScopesRadix(data: ApplicationItem[] | null) {
    const radix = new RadixRouter();

    if (!data || data.length === 0) return radix;

    data.map(item => {
      // Insert scope path into the tree
      if (item.manifest.scope) {
        this.tryInsertRadixPath(radix, item, item.manifest.scope);
      }

      // Insert all extended scopes into the tree
      if (item.manifest.extended_scopes) {
        for (const scope of item.manifest.extended_scopes) {
          this.tryInsertRadixPath(radix, item, scope);
        }
      }
    });

    return radix;
  }

  // UTILS

  private tryInsertRadixPath(radix: any, item: ApplicationConnectionNode['node'], scope: string) {
    try {
      const path = this.toRadixPath(scope);
      const radixObject = {
        data: {
          manifestURL: item.bxAppManifestURL,
          name: item.name,
        },
      };
      radix.insert({
        path, // because wildcard does not match with root url (e.g. https://getstation.com)
        ...radixObject,
      });
      radix.insert({
        path: `${path}/**`,
        ...radixObject,
      });
    } catch (e) {
      handleError()(e, {
        metaData: {
          scope,
          manifestURL: item.bxAppManifestURL,
        },
      });
    }
  }

  private matchScope(url: ParsedURL, scope: ParsedURL): boolean {
    const matchingSubdomains = (
      url.subdomain === scope.subdomain
      || (url.subdomain === '*' && Boolean(scope.subdomain))
      || (Boolean(url.subdomain) && scope.subdomain === '*')
    );

    const matchingPathname = (
      !Boolean(scope.pathname)
      || (Boolean(url.pathname) && url.pathname!.startsWith(scope.pathname!))
    );

    return (
      url.protocol === scope.protocol
      && url.domain === scope.domain
      && url.port === scope.port
      && matchingSubdomains
      && matchingPathname
    );
  }

  private parseUrl(rawUrl: string): ParsedURL | undefined {
    if (!rawUrl) return undefined;

    // URL module in browser escapes some characters, that NodeJS 'url' module don't
    const url = new NodeURL(rawUrl);
    const splitHostname = url.hostname.split('.');

    const hostname = (splitHostname.length === 3)
      ? { subdomain: splitHostname.shift(), domain: splitHostname.join('.') }
      : { subdomain: null, domain: url.hostname };

    return {
      protocol: url.protocol,
      subdomain: hostname.subdomain,
      domain: hostname.domain,
      port: isBlank(url.port) ? null : url.port,
      pathname: url.pathname,
    };
  }

  private toRadixPath(rawUrl: any) {
    const parsed = this.parseUrl(rawUrl);
    if (!parsed) return undefined;

    // If subdomain is a wildcard, create a path placeholder sink
    const subdomain = (parsed.subdomain === '*') ? ':subdomain' : parsed.subdomain;
    const pathname = (!parsed.pathname || parsed.pathname === '/') ? '' : parsed.pathname;

    // Build a path like : /http/google/null/www/a/b/c/**
    return `/${parsed.protocol}/${parsed.domain}/${parsed.port}/${subdomain}${pathname}`;
  }

  private hasMatchingTab(url: string) {
    return getTabIdMatchingURL(this.state, url);
  }

  // Gather all the scopes (+ extended scopes) recorded in the manifest of an App
  private async getScopes(app: ApplicationImmutable) {
    const manifestURL = getApplicationManifestURL(app);
    const applicationId = getApplicationId(app);
    const bxApp = await this.manifestProvider.getFirstValue(manifestURL);

    if (!bxApp || !bxApp.manifest || !bxApp.manifest.scope) return undefined;

    // Split the scopes and gather the extended scopes
    const scopes = bxApp.manifest.scope.split(',');
    const extendedScope = (bxApp.manifest.extended_scopes) ? bxApp.manifest.extended_scopes : [];

    // Add customScopes (on-premise configuration)
    const customURLs = getApplicationCustomURLsWithApplicationId(this.getState(), applicationId);
    const customScopes = customURLs.map(normalizeURL);

    // Mix everything
    return uniq([...customScopes, ...scopes, ...extendedScope]);
  }
}
