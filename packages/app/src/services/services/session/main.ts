import * as Electron from 'electron';
import { waitDefaultSession } from '../../api/sessions';
import { RPC } from '../../lib/types';
import { SessionService, SessionProviderService } from './interface';

export type SessionOptions = { partition: string };

export class SessionServiceImpl extends SessionService implements RPC.Interface<SessionService> {
  private session?: Electron.Session;
  private provider?: RPC.Node<SessionProviderService>;

  constructor(uuid?: string, options?: SessionOptions) {
    super(uuid, { ready: false });
    this.initSession(options).then(session => {
      this.session = session;
      this.ready();
    });
  }

  init(provider: RPC.Node<SessionProviderService>) {
    this.provider = provider;
  }

  async getUserAgent(): Promise<string> {
    const session = await this.getSession();
    return session.getUserAgent();
  }

  async getCookies(filter: Electron.CookiesGetFilter): Promise<Electron.Cookie[]> {
    const session = await this.getSession();
    return session.cookies.get(filter);
  }

  private async initSession(options?: SessionOptions): Promise<Electron.Session> {
    if (options && options.partition) {
      return Electron.session.fromPartition(options.partition);
    }
    return waitDefaultSession();
  }

  private async getSession(): Promise<Electron.Session> {
    await this.whenReady();
    return this.session!;
  }
}
