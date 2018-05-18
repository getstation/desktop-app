import { Consumer } from '../common';
import { tabs } from './index';

const protectedProvidersWeakMap = new WeakMap<TabsConsumer, tabs.TabsProviderInterface>();

export class TabsConsumer extends Consumer implements tabs.TabsConsumer {

  public readonly namespace = 'tabs';
  public id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  getTabs() {
    return protectedProvidersWeakMap.get(this)!.getTabs(this.id);
  }

  navToTab(tabId: string) {
    return protectedProvidersWeakMap.get(this)!.navToTab(tabId);
  }

  executeJavaScript(tabId: string, code: string) {
    return protectedProvidersWeakMap.get(this)!.executeJavaScript(tabId, code);
  }

  setProviderInterface(providerInterface: tabs.TabsProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
