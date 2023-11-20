import {
  Provider, Consumer, Consumers,
  activity, config, history, ipc, react, search, session, storage, tabs, resources,
} from '@getstation/sdk';
import ResourceRouterDispatcher from '../resources/ResourceRouterDispatcher';
import { StationStore } from '../types';
import ActivityProvider from './activity/ActivityProvider';
import { AbstractProvider } from './common';
import ConfigProvider from './config/ConfigProvider';
import HistoryProvider from './history/HistoryProvider';
import IpcProvider from './ipc/IpcProvider';
import ReactProvider from './react/ReactProvider';
import SearchProvider from './search/SearchProvider';
import SessionProvider from './session/SessionProvider';
import StorageProvider from './storage/StorageProvider';
import TabsProvider from './tabs/TabsProvider';
import ResourcesProvider from './resources/ResourcesProvider';

export type Providers = SearchProvider |
  StorageProvider |
  TabsProvider |
  SessionProvider |
  ReactProvider |
  IpcProvider |
  ActivityProvider |
  HistoryProvider |
  ConfigProvider |
  ResourcesProvider;

export abstract class BxSDK implements Provider {
  public search: BxSubSDK<SearchProvider, search.SearchConsumer>;
  public storage: BxSubSDK<StorageProvider, storage.StorageConsumer>;
  public tabs: BxSubSDK<TabsProvider, tabs.TabsConsumer>;
  public session: BxSubSDK<SessionProvider, session.SessionConsumer>;
  public react: BxSubSDK<ReactProvider, react.ReactConsumer>;
  public ipc: BxSubSDK<IpcProvider, ipc.IpcConsumer>;
  public activity: BxSubSDK<ActivityProvider, activity.ActivityConsumer>;
  public history: BxSubSDK<HistoryProvider, history.HistoryConsumer>;
  public config: BxSubSDK<ConfigProvider, config.ConfigConsumer>;
  public resources: BxSubSDK<ResourcesProvider, resources.ResourcesConsumer>;

  protected _store: StationStore;

  register(consumer: Consumers) {
    if (!(consumer.namespace in this)) {
      console.warn(`Namespace ${consumer.namespace} is not registered`);
      return;
    }
    this[consumer.namespace].register(consumer as any); // TODO fix typing
  }

  unregister(consumer: Consumers) {
    if (!(consumer.namespace in this)) {
      console.warn(`Namespace ${consumer.namespace} is not registered`);
      return;
    }
    this[consumer.namespace].unregister(consumer as any); // TODO fix typing
  }

  init(..._args: any[]) { }
}

export class BxSDKWorker extends BxSDK {
  protected _store: StationStore;

  constructor() {
    super();
    this.search = new BxSubSDK(new SearchProvider());
    this.ipc = new BxSubSDK(new IpcProvider());
    this.activity = new BxSubSDK(new ActivityProvider());
    this.history = new BxSubSDK(new HistoryProvider());
  }

  init(store: StationStore, resourceRouter: ResourceRouterDispatcher) {
    this._store = store;

    this.resources = new BxSubSDK(new ResourcesProvider(resourceRouter));

    this.storage = new BxSubSDK(new StorageProvider(store));
    this.config = new BxSubSDK(new ConfigProvider(store));

    // TabsProvider includes `ApplicationsActions` which completely fucks up TS compilation during tests.
    // By using `require` instead of the `import`ed TabsProvider, we ensure that
    // it's not handled by tsc at parsing, but by ts-node during execution.
    const TabsProviderClass = require('./tabs/TabsProvider').default;
    this.tabs = new BxSubSDK(new TabsProviderClass(store));

    const SessionProviderClass = require('./session/SessionProvider').default;
    this.session = new BxSubSDK(new SessionProviderClass(store));
  }
}

export class BxSDKRenderer extends BxSDK {
  constructor() {
    super();
    this.ipc = new BxSubSDK(new IpcProvider());
    this.react = new BxSubSDK(new ReactProvider());
  }
}

export class BxSubSDK<P extends AbstractProvider<C>, C extends Consumer> {

  public provider: P;

  constructor(provider: P) {
    this.provider = provider;
  }

  register(consumer: C) {
    this.provider.addConsumer(consumer);
  }

  unregister(consumer: C) {
    this.provider.removeConsumer(consumer);
  }
}
const bxSDK = process.worker ? new BxSDKWorker() : new BxSDKRenderer();

export default bxSDK;
