import { people_v1 } from 'googleapis/build/src/apis/people/v1';
import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';
import { Credentials } from 'google-auth-library';

export type ElectronGoogleSignInResponse = {
  tokens: Credentials,
  profile: people_v1.Schema$Person,
}

@service('electron-google-oauth')
export class ElectronGoogleOAuthService extends ServiceBase implements RPC.Interface<ElectronGoogleOAuthService> {
  @timeout(0)
  // @ts-ignore
  signIn(scopes: string[], forceAddSession?: boolean): Promise<ElectronGoogleSignInResponse> {}
}
