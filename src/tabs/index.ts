import { Consumer } from '../common';

export namespace tabs {

  export interface TabsConsumer extends Consumer {
    readonly id: string;

    getTabs(): any;
    navToTab(tabId: string): Promise<void>
    executeJavaScript(tabId: string, code: string): Promise<void>;
    setProviderInterface(providerInterface: tabs.TabsProviderInterface): void
  }

  export interface TabsProviderInterface {
    getTabs(id: string): any;
    navToTab(tabId: string): Promise<void>
    executeJavaScript(tabId: string, code: string): Promise<void>;
  }

}
