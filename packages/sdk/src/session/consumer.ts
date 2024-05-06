import { Consumer, DefaultWeakMap } from '../common';

import { session } from './index';

const protectedProvidersWeakMap = new DefaultWeakMap<SessionConsumer, session.SessionProviderInterface>();

export class SessionConsumer extends Consumer implements session.SessionConsumer {

  public readonly namespace = 'session';

  getUserAgent() {
    return protectedProvidersWeakMap.get(this)!.getUserAgent();
  }

  getCookies() {
    return protectedProvidersWeakMap.get(this)!.getCookies(this.id);
  }

  setProviderInterface(providerInterface: session.SessionProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
