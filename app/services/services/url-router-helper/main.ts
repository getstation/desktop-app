import { URLRouterHelperService } from './interface';
import { RPC } from '../../lib/types';
import { resolveRedirects } from './lib';

export class URLRouterHelperServiceImpl extends URLRouterHelperService implements RPC.Interface<URLRouterHelperService> {
  async resolveRedirects({ url }: { url: string }) {
    return resolveRedirects(url);
  }
}
