import { Observable } from 'rxjs/Observable';
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
     * Receive tabs updates
     * @example
     * sdk.tabs.getTabsObservable().subscribe(tabs => {
     *  ...
     * });
     */
    getTabsObservable(id: string): Observable<tabs.Tab[]>;
    /**
     * Receive nav updates
     * @example
     * const nav = sdk.tabs.nav();
     */
    nav(): Observable<tabs.Nav>;
    /**
     * Navigate to given tabId
     * @example
     * sdk.tabs.navToTab('mysaas-XXXXXXXXX/XXXXXXXXX');
     */
    navToTab(tabId: string): void
    /**
     * Dispatch URL to given tabId
     * @example
     * sdk.tabs.dispatchUrlInTab('mysaas-XXXXXXXXX/XXXXXXXXX', 'https://mysaas.com/xxxx');
     */
    dispatchUrlInTab(tabId: string, url: string): void
    /**
     * Get tab webContents state
     * @example
     * sdk.tabs.getTabWebContentsState('mysaas-XXXXXXXXX/XXXXXXXXX');
     */
    getTabWebContentsState(tabId: string): TabWebContentsState
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
    executeJavaScript(tabId: string, code: string): Promise<any>;
    setProviderInterface(providerInterface: tabs.TabsProviderInterface): void
  }

  export interface TabsProviderInterface {
    getTabs(id: string): Tab[];
    getTabsObservable(id: string): Observable<tabs.Tab[]>;
    nav(): Observable<tabs.Nav>;
    navToTab(tabId: string): Promise<void>
    executeJavaScript(tabId: string, code: string): Promise<void>;
    navToTab(tabId: string): void
    dispatchUrlInTab(tabId: string, url: string): void
    getTabWebContentsState(tabId: string): TabWebContentsState
    executeJavaScript(tabId: string, code: string): Promise<any>
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
  };

  export type Nav = {
    tabApplicationId: string,
    previousTabApplicationId: string,
  };

  export enum TabWebContentsState {
    notMounted,
    waitingToAttach,
    detaching,
    mounted,
    crashed,
  }
}
