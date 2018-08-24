import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { Consumer } from '../common';
import { activity } from './index';

import QueryArgs = activity.QueryArgs;
import ActivityEntry = activity.ActivityEntry;

const protectedProvidersWeakMap = new WeakMap<activity.ActivityConsumer, activity.ActivityProviderInterface>();

export class ActivityConsumer extends Consumer implements activity.ActivityConsumer {
  public readonly namespace = 'activity';

  push(resourceId: string, extraData?: object, type?: string): Promise<{ activityEntryId: string }> {
    return protectedProvidersWeakMap.get(this)!.push({
      type: type || '',
      createdAt: Date.now(),
      resourceId,
      extraData,
    });
  }


  query(userQueryArgs: Partial<QueryArgs> = {}): Observable<ActivityEntry[]> {
    const queryArgs: QueryArgs = {
      orderBy: 'createdAt',
      ascending: false,
      limit: 1,
      resourceId: null,
      type: null,
      global: true,
      ...userQueryArgs,
    };
    const consumer = protectedProvidersWeakMap.get(this)!;
    const obs: Observable<Observable<ActivityEntry[]>> = Observable.from(consumer.query(queryArgs));
    return obs.pipe(flatMap(x => x)); // flatten observable
  }


  setProviderInterface(providerInterface: activity.ActivityProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
