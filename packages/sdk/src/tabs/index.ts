import { Observable } from 'rxjs';

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
     * Receive tab updates
     * @example
     * sdk.tabs.getTab('mysaas-XXXXXXXXX/XXXXXXXXX').subscribe(tab => {
     *  ...
     * });
     */
    getTab(id: string): Observable<tabs.Tab>;

    /**
     * Modifies the properties of a tab.
     *
     * Properties that are not specified in updatedTab are not modified.
     *
     * Modifying the url will trigger a navigation.
     * @example
     * sdk.tabs.updateTab('mysaas-XXXXXXXXX/XXXXXXXXX', { url: 'https://google.com' }).
     */
    updateTab(tabId: string, updatedTab: TabUpdate): void;
    /**
     * Receive nav updates
     * @example
     * const nav = sdk.tabs.nav();
     */
    nav(): Observable<tabs.Nav>;
    /**
     * Create a tab for given application and navigate to the given url
     * @example`
     * sdk.tabs.create({ applicationId: 'slack', url: 'https://google.fr' });
    */
    create(options: CreateOptions): void;
    /**
     * Navigate to given tabId.
     * Silent option will notify activity api to allow
     * plugins history recording to ignore automatic
     * navigation (not triggered by the end user)
     * @example
     * sdk.tabs.navToTab('mysaas-XXXXXXXXX/XXXXXXXXX');
     */
    navToTab(tabId: string, options?: NavToTabOptions): void
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
    getTab(tabId: string): Observable<tabs.Tab>;
    nav(): Observable<tabs.Nav>;
    create(options: CreateOptions): void;
    updateTab(tabId: string, updatedTab: TabUpdate): void;
    navToTab(tabId: string, options: NavToTabOptions): Promise<void>
    executeJavaScript(tabId: string, code: string): Promise<void>;
    getTabWebContentsState(tabId: string): TabWebContentsState
  }

  export type NavToTabOptions = {
    silent: boolean,
  };

  export interface CreateOptions {
    applicationId: string,
    url: string,
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

  export type TabUpdate = {
    url?: string,
  };

  export type Nav = {
    tabId: string,
    previousTabId: string,
  };

  export enum TabWebContentsState {
    notMounted,
    waitingToAttach,
    detaching,
    mounted,
    crashed,
  }
}
