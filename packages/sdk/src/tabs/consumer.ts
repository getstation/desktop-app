import { Observable } from 'rxjs';

import { Consumer, DefaultWeakMap } from '../common';

import { tabs } from './index';

const protectedProvidersWeakMap = new DefaultWeakMap<TabsConsumer, tabs.TabsProviderInterface>();

export class TabsConsumer extends Consumer implements tabs.TabsConsumer {
  public readonly namespace = 'tabs';

  getTabs() {
    return protectedProvidersWeakMap.get(this)!.getTabs(this.id);
  }

  getTab(tabId: string): Observable<tabs.Tab> {
    return protectedProvidersWeakMap.get(this)!.getTab(tabId);
  }

  updateTab(tabId: string, updatedTab: tabs.TabUpdate): void {
    return protectedProvidersWeakMap.get(this)!.updateTab(tabId, updatedTab);
  }

  navToTab(tabId: string, options: tabs.NavToTabOptions = { silent: false }) {
    return protectedProvidersWeakMap.get(this)!.navToTab(tabId, options);
  }

  nav() {
    return protectedProvidersWeakMap.get(this)!.nav();
  }

  create(options: tabs.CreateOptions) {
    return protectedProvidersWeakMap.get(this)!.create(options);
  }

  getTabWebContentsState(tabId: string) {
    return protectedProvidersWeakMap.get(this)!.getTabWebContentsState(tabId);
  }

  executeJavaScript(tabId: string, code: string) {
    return protectedProvidersWeakMap.get(this)!.executeJavaScript(tabId, code);
  }

  setProviderInterface(providerInterface: tabs.TabsProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
