import { RPC } from '../../lib/types';
import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';

/**
 * Serves as helper for the URL router.
 */
@service('url-router-helper')
export class URLRouterHelperService extends ServiceBase implements RPC.Interface<URLRouterHelperService> {
  /**
   * For a given URL, will recursively follow the redirect responses until the final URL and returns the final URL.
   *
   * Will make sure session's cookies are used to work around [electron/electron#8891](https://github.com/electron/electron/issues/8891).
   */
  // @ts-ignore
  resolveRedirects(param: { url: string }): Promise<{ url: string, resolution: number }> {}
}
