import 'rxjs/Rx';
import { ReactConsumer } from './react/consumer';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';
import { TabsConsumer } from './tabs/consumer';

export * from './common';
export * from './search';
export * from './storage';
export * from './tabs';
export * from './react';

export type Consumers =
  SearchConsumer |
  StorageConsumer |
  TabsConsumer |
  ReactConsumer;

export interface SDKOptions {
  id: string,
  name: string,
}

export interface SDK {
  readonly search: SearchConsumer,
  readonly storage: StorageConsumer,
  readonly tabs: TabsConsumer,
  readonly react: ReactConsumer,
  close(): void,
}

export interface Provider {
  register(consumer: Consumers): void;
  unregister(consumer: Consumers): void;
}

export default function sdk(options: SDKOptions, provider: Provider): SDK {
  const search = new SearchConsumer();
  const storage = new StorageConsumer(options.id);
  const tabs = new TabsConsumer(options.id);
  const react = new ReactConsumer();
  provider.register(search);
  provider.register(storage);
  provider.register(tabs);
  provider.register(react);
  const bxsdk: SDK = {
    search: search,
    storage: storage,
    tabs: tabs,
    react: react,
    close() {
      provider.unregister(search);
      provider.unregister(storage);
      provider.unregister(tabs);
      provider.unregister(react);
    },
  };
  Object.freeze(bxsdk);
  return bxsdk;
}
