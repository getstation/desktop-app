import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { history } from '.';
import { Consumer } from '../common';

export class HistoryConsumer extends Consumer implements history.HistoryConsumer {
  public readonly namespace = 'history';
  public entries: BehaviorSubject<history.HistoryEntry[]>;

  constructor(id: string) {
    super(id);
    this.entries = new BehaviorSubject([]);
  }
}
