import { Observable } from 'rxjs';

import { Consumer } from '../common';

export namespace activity {
  export interface ActivityConsumer extends Consumer {
    /**
     * Will push an activity entry for the given search result item.
     *
     * @param resourceId the id of the SearchResultItem this activity corresponds to
     * @param serviceId the service id corresponding to the resource id
     * @param extraData a set of key-value that can be used for anything
     * @param type of activity
     * @returns a promise with the activityEntryId (which represents the id in sqlite db)
     */
    push(resourceId: string, extraData?: any, type?: string, serviceId?: string): Promise<{ activityEntryId: string }>;

    /**
     * Query the last **n** activity logs of the plugin.
     *
     * @example
     * // get the last 10 pushed activity entries
     * sdk.activity.query({limit: 10, ascending: false}).subscribe(items => {
     *  doSomething(items);
     * })
     *
     * @param query a QueryArgs item
     * @returns an observable of array of ActivityEntry
     */
    query(query: QueryArgs): Observable<ActivityEntry[]>;

    setProviderInterface(providerInterface: ActivityProviderInterface): void;
  }

  export interface ActivityEntry {
    resourceId: string, // the id of the SearchResultItem this activity corresponds to
    serviceId: string, // the service id corresponding to the resource id
    type: string, // type of activity entry
    extraData?: any, // a set of key-value that can be used for anything
    createdAt: number, // timestamp at which the activity was made. By default, at the time the function is called
  }

  export type ScopeFilter = string[] | string | null;

  export type QueryArgsScope = {
    resourceIds: ScopeFilter,
    serviceIds: ScopeFilter,
    types: ScopeFilter,
  };

  export interface QueryArgs {
    orderBy: 'createdAt', // get the last n results or the first n results
    ascending: boolean, // ascending or descending (default to false)
    limit: number, // limit to the n first result (default to 1)
    global: boolean, // global or plugin activity (default to false)
    where: Partial<QueryArgsScope>,
    whereNot: Partial<QueryArgsScope>,
  }

  export interface ActivityProviderInterface {
    push(activityEntry: ActivityEntry): Promise<{ activityEntryId: string }>;
    query(query: QueryArgs): Promise<Observable<ActivityEntry[]>>;
  }
}
