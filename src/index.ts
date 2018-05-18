import { register, unregister } from './registration';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';
import { TabsConsumer } from './tabs/consumer';

export * from './common';
export * from './registration';
export * from './search';
export * from './storage';
export * from './tabs';

export interface SDKOptions {
  id: string,
  name: string,
}

export interface SDK {
  readonly search: SearchConsumer,
  readonly storage: StorageConsumer,
  readonly tabs: TabsConsumer,
  close(): void,
}

export default function sdk(options: SDKOptions): SDK {
  const search = new SearchConsumer();
  const storage = new StorageConsumer(options.id);
  const tabs = new TabsConsumer(options.id);
  const bxsdk = {
    search: register(search),
    storage: register(storage),
    tabs: register(tabs),
    close() {
      unregister(search);
      unregister(storage);
      unregister(tabs);
    },
  };
  Object.freeze(bxsdk);
  return bxsdk;
}
