import { Consumer, DefaultWeakMap } from '../common';

import { resources } from '.';

const protectedProvidersWeakMap = new DefaultWeakMap<ResourcesConsumer, resources.ResourcesProviderInterface>();

export class ResourcesConsumer extends Consumer implements resources.ResourcesConsumer {
  public readonly namespace = 'resources';

  constructor(manifestURL: string) {
    super(manifestURL);
  }

  setOpenHandler(handler: resources.OpenHandler) {
    return protectedProvidersWeakMap.get(this)!.setOpenHandler(this.id, handler);
  }

  setMetaDataHandler(handler: resources.MetaDataHandler) {
    return protectedProvidersWeakMap.get(this)!.setMetaDataHandler(this.id, handler);
  }

  setProviderInterface(providerInterface: resources.ResourcesProviderInterface): void {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
