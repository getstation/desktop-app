import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Consumer } from '../common';
import { search } from '../index';

export namespace history {

  export interface HistoryConsumer extends Consumer {
    readonly id: string;

    /**
     * Push the history of the application usage
     * @example
     *   sdk.activity
     *     .query({ limit: 10 })
     *     .subscribe((activityEntries: activity.ActivityEntry[]) => {
     *       sdk.history.entries.next(activityAsHistory(activityEntries));
     *     });
     */
    readonly entries: BehaviorSubject<history.HistoryEntry[]>;
  }

  export type HistoryEntry = search.SearchResultItem & {
    date: Date,
  };
}
