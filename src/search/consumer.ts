import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Consumer } from '../common';
import { search } from './index';

export class SearchConsumer extends Consumer implements search.SearchConsumer {

  public readonly namespace = 'search';

  public query: BehaviorSubject<search.SearchQuery>;
  public results: BehaviorSubject<search.SearchResultWrapper>;

  constructor(id: string) {
    super(id);
    this.query = new BehaviorSubject({ value: '' });
    this.results = new BehaviorSubject({});
  }

}
