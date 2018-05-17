import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Consumer } from '../common';

export namespace search {

  export interface SearchConsumer extends Consumer {
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
    url: string,
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


