import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Consumer } from '../common';

export namespace search {

  export interface SearchConsumer extends Consumer {
    readonly query: Subject<string>;
    readonly results: BehaviorSubject<search.SearchResultWrapperConsumer>;
    name: string;

    getResultsObservableForProvider(): Observable<search.SearchResultWrapper>;
  }

  export interface SearchResultWrapper extends SearchResultWrapperConsumer {
    name: string,
  }

  export type SearchResultItem = {
    id: string,
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

  export const BXSDK_SEARCH_DEFAULT_NAME = 'default';
}


