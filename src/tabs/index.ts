import { Consumer } from '../common';

export namespace tabs {

  export interface TabsConsumer extends Consumer {
    readonly id: string;

    getTabs(): Tab[];
    navToTab(tabId: string): Promise<void>
    executeJavaScript(tabId: string, code: string): Promise<void>;
    setProviderInterface(providerInterface: tabs.TabsProviderInterface): void
  }

  export interface TabsProviderInterface {
    getTabs(id: string): Tab[];
    navToTab(tabId: string): Promise<void>
    executeJavaScript(tabId: string, code: string): Promise<void>;
  }

  export type Tab = {
    applicationId: string,
    badge: string,
    canGoBack: boolean,
    canGoForward: boolean,
    favicons: string[],
    isApplicationHome: boolean,
    isLoading: boolean,
    tabId: string,
    title: string,
    url: string,
  }
}
