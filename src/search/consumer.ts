import * as Rx from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Consumer } from '../common';
import { search } from './index';

export class SearchConsumer extends Consumer implements search.SearchConsumer {

  public readonly namespace = 'search';

  public query: Subject<string>;
  public results: BehaviorSubject<search.SearchResultWrapperConsumer>;
  public name: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.query = new Rx.Subject();
    this.results = new BehaviorSubject({});
  }

  getResultsObservableForProvider() {
    return this.results.map(x => ({ ...x, name: this.name } as search.SearchResultWrapper));
  }

}