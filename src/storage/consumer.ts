import { Consumer, DefaultWeakMap } from '../common';

import { StorageEvent } from './event';
import { storage } from './index';

const protectedProvidersWeakMap = new DefaultWeakMap<StorageConsumer, storage.StorageProviderInterface>();

export class StorageConsumer extends Consumer implements storage.StorageConsumer {

  public readonly namespace = 'storage';
  public onChanged: StorageEvent;

  constructor(id: string) {
    super(id);
    this.onChanged = new StorageEvent();
  }

  getItem<R = any>(key: string) {
    return protectedProvidersWeakMap.get(this)!.getItem<R>(this.id, key);
  }

  setItem(key: string, value: any) {
    return protectedProvidersWeakMap.get(this)!.setItem(this.id, key, value);
  }

  setProviderInterface(providerInterface: storage.StorageProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
