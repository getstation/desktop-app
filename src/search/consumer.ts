import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Consumer } from '../common';
import { search } from './index';

export class SearchConsumer extends Consumer implements search.SearchConsumer {

  public readonly namespace = 'search';

  public query: BehaviorSubject<string>;
  public results: BehaviorSubject<search.SearchResultWrapper>;

  constructor() {
    super();
    this.query = new BehaviorSubject('');
    this.results = new BehaviorSubject({});
  }

}