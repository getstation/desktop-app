import { getApplicationManifestURL } from '../applications/get';
import URLRouter from '../urlrouter/URLRouter';
import { BX_RESOURCEID_PREFIX } from './constants';
import { ARIT, ResourceResolver } from './types';

/**
 * Convert an application URL into a `bxResourceId` and vice-versa
 */
export default class ApplicationResourceResolver implements ResourceResolver {
  private URLRouter: URLRouter;

  constructor(router: URLRouter) {
    this.URLRouter = router;
  }

  static isBxResourceId(url: string) {
    return url.startsWith(BX_RESOURCEID_PREFIX);
  }

  // get either an ARIT or null from a bxResourceId
  static toARIT(url: string): ARIT | null {
    const parsedUrl = new URL(url);

    const manifestURL = parsedUrl.searchParams.get('manifestURL');
    const appURL = parsedUrl.searchParams.get('url');

    if (!manifestURL || !appURL) return null;

    return [manifestURL, appURL];
  }

  // get bxResourceId from an ARIT
  static fromARIT(arit: ARIT): string {
    const [manifestURL, appURL] = arit;
    const u = new URL(BX_RESOURCEID_PREFIX);
    u.searchParams.append('manifestURL', manifestURL);
    u.searchParams.append('url', appURL);
    return String(u);
  }

  /**
   * Either return a bxResourceId or null
   */
  async resolve(url: string): Promise<string | null> {
    const arit = await this.resolveARIT(url);
    if (!arit) return null;
    return ApplicationResourceResolver.fromARIT(arit);
  }

  /**
   * Either return an ARIT or null
   */
  async resolveARIT(url: string): Promise<ARIT | null> {
    if (ApplicationResourceResolver.isBxResourceId(url)) { // already a bxResourceId
      return ApplicationResourceResolver.toARIT(url);
    }

    // first check if the app is already installed
    const application = await this.URLRouter.findApplicationInInstalledScopes(url);
    // then if it is not, check if we can install it
    const manifestURL = application ? getApplicationManifestURL(application) : this.URLRouter.findInAllScopes(url);
    if (manifestURL) {
      return [manifestURL, url];
    }

    return null;
  }
}
