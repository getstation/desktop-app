// tslint:disable-next-line:no-import-side-effect
import 'rxjs';

import { ActivityConsumer } from './activity/consumer';
import { HistoryConsumer } from './history/consumer';
import { IpcConsumer } from './ipc/consumer';
import { ReactConsumer } from './react/consumer';
import { SearchConsumer } from './search/consumer';
import { SessionConsumer } from './session/consumer';
import { StorageConsumer } from './storage/consumer';
import { TabsConsumer } from './tabs/consumer';

export * from './common';
export * from './search';
export * from './storage';
export * from './tabs';
export * from './session';
export * from './ipc';
export * from './react';
export * from './activity';
export * from './history';

export type Consumers =
  SearchConsumer |
  StorageConsumer |
  TabsConsumer |
  SessionConsumer |
  IpcConsumer |
  ReactConsumer |
  ActivityConsumer |
  HistoryConsumer;

export type ConsumersNamespaces = Pick<Consumers, 'namespace'>;

export interface SDKOptions {
  id: string,
  name: string,
}

export interface SDK {
  readonly search: SearchConsumer,
  readonly storage: StorageConsumer,
  readonly tabs: TabsConsumer,
  readonly session: SessionConsumer,
  readonly ipc: IpcConsumer,
  readonly react: ReactConsumer,
  readonly activity: ActivityConsumer,
  readonly history: HistoryConsumer,
  register(consumer: Consumers): void,
  unregister(consumer: Consumers): void,
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
  const session = new SessionConsumer(options.id);
  const ipc = new IpcConsumer(options.id);
  const react = new ReactConsumer(options.id);
  const activity = new ActivityConsumer(options.id);
  provider.register(search);
  provider.register(storage);
  provider.register(tabs);
  provider.register(session);
  provider.register(ipc);
  provider.register(react);
  provider.register(activity);
  const bxsdk = {
    search,
    storage,
    tabs,
    session,
    ipc,
    react,
    activity,
    register(consumer: Consumers) {
      provider.register(consumer);
      // tslint:disable-next-line:no-invalid-this
      this[consumer.namespace] = consumer;
    },
    unregister(consumer: Consumers) {
      provider.unregister(consumer);
      // tslint:disable-next-line:no-invalid-this
      delete this[consumer.namespace];
    },
    close() {
      provider.unregister(search);
      provider.unregister(storage);
      provider.unregister(tabs);
      provider.unregister(session);
      provider.unregister(ipc);
      provider.unregister(react);
      provider.unregister(activity);
    },
  };
  // @ts-ignore
  return bxsdk;
}
