import { BehaviorSubject } from 'rxjs';

import { Consumer } from '../common';

import { history } from '.';

export class HistoryConsumer extends Consumer implements history.HistoryConsumer {
  public readonly namespace = 'history';
  public entries: BehaviorSubject<history.HistoryEntry[]>;

  constructor(id: string) {
    super(id);
    this.entries = new BehaviorSubject([]);
  }
}
