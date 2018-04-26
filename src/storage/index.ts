import { Consumer } from '../common';

export namespace storage {

  export interface StorageConsumer extends Consumer {
    readonly id: string;

    getItem<R=any>(key: string): R;
    setItem(key: string, value: any): void;
    setProviderInterface(providerInterface: storage.StorageProviderInterface): void
  }

  export interface StorageProviderInterface {
    setItem(consumerKey: string, key: string, value: any): void;
    getItem<R=any>(consumerKey: string, key: string): R;
  }

}
