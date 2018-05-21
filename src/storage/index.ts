import { Consumer } from '../common';
import { StorageEvent } from './event';

export namespace storage {

  export interface StorageConsumer extends Consumer {
    readonly id: string;
    readonly onChanged: StorageEvent;

    getItem<R = any>(key: string): Promise<R | undefined>;
    setItem(key: string, value: any): Promise<void>;
    setProviderInterface(providerInterface: storage.StorageProviderInterface): void
  }

  export interface StorageProviderInterface {
    setItem(consumerKey: string, key: string, value: any): Promise<void>;
    getItem<R = any>(consumerKey: string, key: string): Promise<R | undefined>;
  }

}
