import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Consumer, DefaultWeakMap } from '../common';

import { activity } from './index';

import QueryArgs = activity.QueryArgs;
import ActivityEntry = activity.ActivityEntry;

const protectedProvidersWeakMap = new DefaultWeakMap<activity.ActivityConsumer, activity.ActivityProviderInterface>();

export class ActivityConsumer extends Consumer implements activity.ActivityConsumer {
  public readonly namespace = 'activity';

  push(resourceId: string, extraData?: object, type?: string, manifestURL?: string): Promise<{ activityEntryId: string }> {
    return protectedProvidersWeakMap.get(this)!.push({
      type: type || '',
      createdAt: Date.now(),
      resourceId,
      manifestURL: manifestURL,
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
        manifestURLs: null,
        types: null,
      },
      whereNot: {
        resourceIds: null,
        manifestURLs: null,
        types: null,
      },
      ...userQueryArgs,
    };

    const consumer = protectedProvidersWeakMap.get(this)!;

    return from(consumer.query(queryArgs))
      .pipe(flatMap(c => c));
  }

  setProviderInterface(providerInterface: activity.ActivityProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
