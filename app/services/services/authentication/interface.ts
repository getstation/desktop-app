import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';
import { OAuthResponseBody } from './types';

@service('authentication')
export class AuthenticationService extends ServiceBase implements RPC.Interface<AuthenticationService> {
  @timeout(0)
  // @ts-ignore
  login(): Promise<OAuthResponseBody> {}

  // @ts-ignore
  renew(refreshToken?: string): Promise<OAuthResponseBody> {}
}
