import 'rxjs/Rx';
import { IpcConsumer } from './ipc/consumer';
import { ReactConsumer } from './react/consumer';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';
import { TabsConsumer } from './tabs/consumer';

export * from './common';
export * from './search';
export * from './storage';
export * from './tabs';
export * from './ipc';
export * from './react';

export type Consumers =
  SearchConsumer |
  StorageConsumer |
  TabsConsumer |
  IpcConsumer |
  ReactConsumer;

export interface SDKOptions {
  id: string,
  name: string,
}

export interface SDK {
  readonly search: SearchConsumer,
  readonly storage: StorageConsumer,
  readonly tabs: TabsConsumer,
  readonly ipc: IpcConsumer,
  readonly react: ReactConsumer,
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
  const react = new ReactConsumer(options.id);
  provider.register(search);
  provider.register(storage);
  provider.register(tabs);
  provider.register(ipc);
  provider.register(react);
  const bxsdk = {
    search,
    storage,
    tabs,
    ipc,
    react,
    close() {
      provider.unregister(search);
      provider.unregister(storage);
      provider.unregister(tabs);
      provider.unregister(ipc);
      provider.unregister(react);
    },
  };
  Object.freeze(bxsdk);
  return bxsdk;
}
