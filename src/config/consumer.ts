import { Consumer } from '../common';
import { config } from './index';

const protectedProvidersWeakMap = new WeakMap<ConfigConsumer, config.ConfigProviderInterface>();

export class ConfigConsumer extends Consumer implements config.ConfigConsumer {
  public readonly namespace = 'config';

  get configData() {
    return protectedProvidersWeakMap.get(this)!.configData;
  }

  setProviderInterface(providerInterface: config.ConfigProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }

  setIcon(applicationId: string, url: string): void {
    return protectedProvidersWeakMap.get(this)!.setIcon(applicationId, url);
  }
}
