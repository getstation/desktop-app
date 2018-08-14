import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Consumer } from '../common';

export namespace search {

  export interface SearchConsumer extends Consumer {
    readonly id: string;

    /**
     * Receive query string updates
     * @example
     * sdk.search.query.subscribe(query => {
     *   // Query external provider
     *   fetch(`https://api.example.com/search/${encodeURIComponent(query.value)}`)
     *    .then(response => response.json())
     *    .then(data => console.log(data));
     * });
     */
    readonly query: Subject<search.SearchQuery>;

    /**
     * Push search results
     * @example
     * sdk.search.results.next({
     *   loading: 'My Category',
     *   results: [
     *    {
     *     id: 'search-result-1',
     *     category: 'My Category',
     *     label: 'Pizza list',
     *     url: 'https://my.example.com/pizza',
     *     imgUrl: 'https://my.example.com/pizza.png',
     *    },
     *    {
     *     id: 'search-result-2',
     *     category: 'My Other Category',
     *     label: 'Message Georges',
     *     imgUrl: 'https://my.example.com/pizza.png',
     *     onSelect: async () => {
     *       const tabId = this.sdk.tabs.getTabs()[0].tabId;
     *       const code = `
     *         var state = { page: '/messages/${id}' };
     *         history.pushState(state, '', '${this.teamDomain}/messages/${id}');
     *         var popStateEvent = new PopStateEvent('popstate', { state: state });
     *         dispatchEvent(popStateEvent);
     *       `;
     *       this.sdk.tabs.executeJavaScript(tabId, code);
     *       await this.sdk.tabs.navToTab(tabId);
     *     }
     *    },
     *    ...,
     *   ],
     * });
     */
    readonly results: BehaviorSubject<search.SearchResultWrapper>;
  }

  export type SearchResultItem = {
    id: string,
    category: string,
    additionalSearchString?: string,
    serviceId?: string,
    label: string,
    context?: string,
    url?: string,
    imgUrl: string,
    onSelect?: () => void,
  };

  export interface SearchResultWrapper {
    results?: SearchResultItem[],
    loading?: string,
  }

  export interface SearchQuery {
    value: string,
  }
}
