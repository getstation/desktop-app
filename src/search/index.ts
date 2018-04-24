import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Rx from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Consumer } from '../common';

export namespace search {
  export interface SearchResultWrapper extends SearchResultWrapperConsumer {
    name: string,
  }

  export type SearchResultItem = {
    id: string,
    category: string,
    additionalSearchString?: string,
    serviceId?: string,
    label: string,
    url: string,
    imgUrl: string,
  };

  export interface SearchResultWrapperConsumer {
    results?: SearchResultItem[],
    loading?: boolean,
  }

  export interface SearchConsumerRegistration {
    namespace: 'search',
    register?: SearchConsumer,
    unregister?: SearchConsumer,
  }

  export const BXSDK_SEARCH_DEFAULT_NAME = 'default';

  export class SearchConsumer extends Consumer {

    public readonly namespace = 'search';

    public query: Subject<string>;
    public results: BehaviorSubject<SearchResultWrapperConsumer>;
    public resultsForProvider: BehaviorSubject<SearchResultWrapper>;
    public name: string;

    constructor(name: string) {
      super();
      this.name = name;
      this.query = new Rx.Subject();
      this.results = new BehaviorSubject({});
      this.resultsForProvider = new BehaviorSubject({ name });
      this.results
        .map(x => ({ ...x, name }))
        .subscribe(this.resultsForProvider);
    }

  }
}
