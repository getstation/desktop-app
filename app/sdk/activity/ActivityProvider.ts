import { activity } from '@getstation/sdk';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { AbstractProvider } from '../common';
import { deserializeActivityEntry, getSerializedQueryParams } from './api';
import createActivityObservable from './createActivityObservable';
import { GlobalActivityEntry, SerializedActivityEntry } from './types';

import ActivityConsumer = activity.ActivityConsumer;
import ActivityEntry = activity.ActivityEntry;
import QueryArgs = activity.QueryArgs;

export default class ActivityProvider extends AbstractProvider<ActivityConsumer> {
  private globalActivity: Subject<GlobalActivityEntry> = new Subject();
  private Activity = require('../../activity/model').default;

  addConsumer(consumer: ActivityConsumer) {
    super.pushConsumer(consumer);
    consumer.setProviderInterface(this.getProviderInterface(consumer));
    super.subscribeConsumer(consumer, () => {
      this.globalActivity.unsubscribe();
    });
  }

  getProviderInterface(consumer: ActivityConsumer): activity.ActivityProviderInterface {
    return {
      push: this.createPushMethod(consumer),
      query: this.createQueryMethod(consumer),
    };
  }

  pushDb = async (consumer: ActivityConsumer, activityEntry: ActivityEntry): Promise<string> => {
    const savedEntry = await this.Activity.build({
      pluginId: consumer.id,
      resourceId: activityEntry.resourceId,
      manifestURL: activityEntry.manifestURL,
      type: activityEntry.type,
      extraData: JSON.stringify(activityEntry.extraData),
      createdAt: activityEntry.createdAt,
    }).save();
    return savedEntry.dataValues.id;
  }

  queryDb = async (consumer: ActivityConsumer, queryArgs: QueryArgs): Promise<SerializedActivityEntry[]> => {
    const serializedQueryArgs = getSerializedQueryParams(consumer, queryArgs);
    const records = await this.Activity.findAll(serializedQueryArgs);

    return records.map((record: any) => record.dataValues);
  }

  createPushMethod(consumer: ActivityConsumer) {
    return async (activityEntry: ActivityEntry): Promise<{ activityEntryId: string }> => {
      const savedEntryId = await this.pushDb(consumer, activityEntry);
      this.globalActivity.next({ ...activityEntry, pluginId: consumer.id });
      return { activityEntryId: savedEntryId };
    };
  }

  createQueryMethod(consumer: ActivityConsumer) {
    return async (queryArgs: QueryArgs): Promise<Observable<ActivityEntry[]>> => {
      const dbResults: SerializedActivityEntry[] = await this.queryDb(consumer, queryArgs);
      const activityResults: GlobalActivityEntry[] = dbResults.map(deserializeActivityEntry);

      return createActivityObservable({ queryArgs, pluginId: consumer.id }, activityResults, this.globalActivity);
    };
  }
}
