import { Consumer } from '../common';
import { StorageEvent } from './event';

export namespace storage {

  export interface StorageConsumer extends Consumer {
    readonly id: string;
    /**
     * @event onChanged - Fired when one or more items change
     * @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/onChanged
     */
    readonly onChanged: StorageEvent;

    /**
     * Retrieves one item from the storage.
     * @param {string} key
     * @returns A Promise that will be fulfilled with a results object
     * containing the object that was found
     */
    getItem<R = any>(key: string): Promise<R | undefined>;

    /**
     * Stores one item in the storage area, or update existing item.
     * @param {string} key
     * @param value
     * @fires onChanged
     * @returns A Promise that will be fulfilled with no arguments if the operation succeeded
     */
    setItem(key: string, value: any): Promise<void>;
    setProviderInterface(providerInterface: storage.StorageProviderInterface): void;
  }

  export interface StorageProviderInterface {
    setItem(consumerKey: string, key: string, value: any): Promise<void>;
    getItem<R = any>(consumerKey: string, key: string): Promise<R | undefined>;
  }

}
