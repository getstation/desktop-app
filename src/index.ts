import 'rxjs/Rx';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';
import { TabsConsumer } from './tabs/consumer';

export * from './common';
export * from './search';
export * from './storage';
export * from './tabs';

export type Consumers = SearchConsumer | StorageConsumer | TabsConsumer;

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

export interface Provider {
  register(consumer: Consumers): void;
  unregister(consumer: Consumers): void;
}

export default function sdk(options: SDKOptions, provider: Provider): SDK {
  const search = new SearchConsumer(options.id);
  const storage = new StorageConsumer(options.id);
  const tabs = new TabsConsumer(options.id);
  provider.register(search);
  provider.register(storage);
  provider.register(tabs);
  const bxsdk = {
    search,
    storage,
    tabs,
    close() {
      provider.unregister(search);
      provider.unregister(storage);
      provider.unregister(tabs);
    },
  };
  Object.freeze(bxsdk);
  return bxsdk;
}
