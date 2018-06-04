import 'rxjs/Rx';
import { IpcConsumer } from './ipc/consumer';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';
import { TabsConsumer } from './tabs/consumer';

export * from './common';
export * from './search';
export * from './storage';
export * from './tabs';
export * from './ipc';

export type Consumers = SearchConsumer | StorageConsumer | TabsConsumer | IpcConsumer;

export interface SDKOptions {
  id: string,
  name: string,
}

export interface SDK {
  readonly search: SearchConsumer,
  readonly storage: StorageConsumer,
  readonly tabs: TabsConsumer,
  readonly ipc: IpcConsumer,
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
  const ipc = new IpcConsumer(options.id);
  provider.register(search);
  provider.register(storage);
  provider.register(tabs);
  provider.register(ipc);
  const bxsdk = {
    search,
    storage,
    tabs,
    ipc,
    close() {
      provider.unregister(search);
      provider.unregister(storage);
      provider.unregister(tabs);
      provider.unregister(ipc);
    },
  };
  Object.freeze(bxsdk);
  return bxsdk;
}
