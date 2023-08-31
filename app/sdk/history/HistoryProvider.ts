import { history } from '@getstation/sdk';
import { combineLatest, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {  } from "rxjs/index";
import { AbstractProvider } from '../common';

export default class HistoryProvider extends AbstractProvider<history.HistoryConsumer> {

  public entries: BehaviorSubject<history.HistoryEntry[]>;
  protected subscriptions: Subscription;

  constructor() {
    super();
    this.entries = new BehaviorSubject([]);
  }

  addConsumer(consumer: history.HistoryConsumer) {
    super.pushConsumer(consumer);
    this.refreshResultsSubscription();
  }

  removeConsumer(consumer: history.HistoryConsumer) {
    super.removeConsumer(consumer);
    this.refreshResultsSubscription();
  }

  protected refreshResultsSubscription() {
    if (this.subscriptions) this.subscriptions.unsubscribe();
    this.subscriptions = combineLatest(this._consumers.map(c => c.entries))
      .pipe(
        map((consumerEntries: history.HistoryEntry[][]) => {
          const flattenEntries = [];

          for (const consumerEntry of consumerEntries) {
            for (const entry of consumerEntry) {
              flattenEntries.push(entry);
            }
          }
          return flattenEntries
            .sort((l, r) => r.date.getTime() - l.date.getTime());
        })
      )
      .subscribe(this.entries);
  }
}
