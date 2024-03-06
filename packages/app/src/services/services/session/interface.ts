import * as Electron from 'electron';
import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('session')
export class SessionService extends ServiceBase implements RPC.Interface<SessionService> {
  // ⚠️This class will also have to handle WhatsApp User-Agent
  // manual override (currently defined in app-main.js)

/* Requests */
  // @ts-ignore
  getUserAgent(): Promise<string> {}
  // @ts-ignore
  getCookies(filter: Electron.CookiesGetFilter): Promise<Electron.Cookie[]> {}
}
