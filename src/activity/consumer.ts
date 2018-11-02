import { Observable } from 'rxjs/Rx';
import { Consumer } from '../common';
import { activity } from './index';

import QueryArgs = activity.QueryArgs;
import ActivityEntry = activity.ActivityEntry;

const protectedProvidersWeakMap = new WeakMap<activity.ActivityConsumer, activity.ActivityProviderInterface>();

export class ActivityConsumer extends Consumer implements activity.ActivityConsumer {
  public readonly namespace = 'activity';

  push(resourceId: string, extraData?: object, type?: string, serviceId?: string): Promise<{ activityEntryId: string }> {
    return protectedProvidersWeakMap.get(this)!.push({
      type: type || '',
      createdAt: Date.now(),
      resourceId,
      serviceId: serviceId || this.id,
      extraData,
    });
  }


  query(userQueryArgs: Partial<QueryArgs> = {}): Observable<ActivityEntry[]> {
    const queryArgs: QueryArgs = {
      orderBy: 'createdAt',
      ascending: false,
      limit: 1,
      global: false,
      where: {
        resourceIds: null,
        serviceIds: null,
        types: null,
      },
      whereNot: {
        resourceIds: null,
        serviceIds: null,
        types: null,
      },
      ...userQueryArgs,
    };

    const consumer = protectedProvidersWeakMap.get(this)!;

    return Observable
      .from(consumer.query(queryArgs))
      .flatMap(c => c);
  }


  setProviderInterface(providerInterface: activity.ActivityProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
