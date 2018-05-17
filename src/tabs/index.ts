import { Consumer } from '../common';

export namespace tabs {

  export interface TabsConsumer extends Consumer {
    readonly id: string;

    /**
     * List all tabs
     * @example
     * const serviceTabs = sdk.tabs.getTabs();
     */
    getTabs(): Tab[];
    /**
     * Navigate to given tabId
     * @example
     * sdk.tabs.navToTab('mysaas-XXXXXXXXX/XXXXXXXXX');
     */
    navToTab(tabId: string): Promise<void>
    /**
     * Execute javascript code in web view for given tabId
     * @example
     *  const code = `
     *    var state = { page: '/messages/${id}' };
     *    history.pushState(state, '', 'https://mysaas.com/messages/${id}');
     *    var popStateEvent = new PopStateEvent('popstate', { state: state });
     *    dispatchEvent(popStateEvent);
     *  `;
     * sdk.tabs.executeJavaScript('mysaas-XXXXXXXXX/XXXXXXXXX', code);
     */
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
