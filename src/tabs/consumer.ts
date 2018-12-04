import { Observable } from 'rxjs/Observable';
import { Consumer } from '../common';
import { tabs } from './index';

const protectedProvidersWeakMap = new WeakMap<TabsConsumer, tabs.TabsProviderInterface>();

export class TabsConsumer extends Consumer implements tabs.TabsConsumer {

  public readonly namespace = 'tabs';

  getTabs() {
    return protectedProvidersWeakMap.get(this)!.getTabs(this.id);
  }

  getTab(tabId: string): Observable<tabs.Tab> {
    return protectedProvidersWeakMap.get(this)!.getTab(tabId);
  }

  navToTab(tabId: string, auto: boolean = false) {
    return protectedProvidersWeakMap.get(this)!.navToTab(tabId, auto);
  }

  nav() {
    return protectedProvidersWeakMap.get(this)!.nav();
  }

  dispatchUrlInTab(tabId: string, url: string) {
    return protectedProvidersWeakMap.get(this)!.dispatchUrlInTab(tabId, url);
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
