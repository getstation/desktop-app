import { Consumer } from '../common';
import { storage } from './index';

const protectedProvidersWeakMap = new WeakMap<StorageConsumer, storage.StorageProviderInterface>();

export class StorageConsumer extends Consumer implements storage.StorageConsumer {

  public readonly namespace = 'storage';
  public id: string;

  constructor(id: string) {
    super();
    this.id = id;
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
