import { Schema$Person } from 'googleapis/build/src/apis/plus/v1';
import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';

@service('electron-google-oauth')
export class ElectronGoogleOAuthService extends ServiceBase implements RPC.Interface<ElectronGoogleOAuthService> {
  @timeout(0)
  // @ts-ignore
  signIn(scopes: string[], forceAddSession?: boolean): Promise<{
    tokens: Credentials,
    profile: Schema$Person,
  }> {}
}
