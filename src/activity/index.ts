import { Observable } from 'rxjs/Observable';
import { Consumer } from '../common';


export namespace activity {
  export interface ActivityConsumer extends Consumer {
    /**
     * Will push an activity entry for the given search result item.
     *
     * @param resourceId the id of the SearchResultItem this activity corresponds to
     * @param extraData a set of key-value that can be used for anything
     * @param type of activity
     * @returns a promise with the activityEntryId (which represents the id in sqlite db)
     */
    push(resourceId: string, extraData?: object, type?: string): Promise<{ activityEntryId: string }>;

    /**
     * Query the last **n** activity logs of the plugin.
     *
     * @example
     * // get the last 10 pushed activity entries
     * sdk.activity.query({limit: 10, ascending: false}).subscribe(items => {
     *  console.log(items);
     * })
     *
     * @param query a QueryArgs item
     * @returns an observable of array of ActivityEntry
     */
    query(query: QueryArgs): Observable<ActivityEntry[]>;

    setProviderInterface(providerInterface: ActivityProviderInterface): void;
  }

  export interface ActivityEntry {
    type: string, // type of activity entry
    resourceId: string, // the id of the SearchResultItem this activity corresponds to
    createdAt: number, // timestamp at which the activity was made. By default, at the time the function is called
    extraData?: object, // a set of key-value that can be used for anything
  }

  export interface QueryArgs {
    orderBy: 'createdAt', // get the last n results or the first n results
    ascending: boolean, // ascending or descending (default to false)
    limit: number, // limit to the n first result (default to 1)
    resourceId: string | null, // if not null, get only the entries for a given resourceId (default to null)
    type: string | null, // if not null, get only the entries for a given type (default to null)

    // when true, subscribe to the global activity
    // when false, subscribe to the concerned plugin activity
    global: boolean, // (default to false)
  }

  export interface ActivityProviderInterface {
    push(activityEntry: ActivityEntry): Promise<{ activityEntryId: string }>;
    query(query: QueryArgs): Promise<Observable<ActivityEntry[]>>;
  }
}
