import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Consumer } from '../common';

export namespace search {

  export interface SearchConsumer extends Consumer {
    readonly query: Subject<string>;
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
  };

  export interface SearchResultWrapper {
    results?: SearchResultItem[],
    loading?: string,
  }
}


