import { activity, SDK, tabs } from '@getstation/sdk';
import { EMPTY, Observable, Subscription } from 'rxjs/Rx';
import { distinctUntilChanged, filter, map, skip, switchMap } from 'rxjs/operators';

import { ResourceExtractor, ResourceRecord } from './resource';

const subscriptions = new Map<activity.ActivityConsumer['id'], Subscription>();

export const startActivityRecording = async (
  sdk: SDK,
  manifestURL: string,
  resourceExtractor: ResourceExtractor
): Promise<Observable<Error>> => {
  const observeCurrentTabNextResource = tabId => (
    sdk.tabs.getTab(tabId)
      .pipe(distinctUntilChanged((before, after) => before.url === after.url))
      .pipe(map((tab: tabs.Tab): ResourceRecord | undefined => {
        if (!tab.url) return;
        const record = resourceExtractor(tab.url);
        if (record) {
          const extraData = {
            ...record.extraData,
            tabId: tab.tabId,
            tabUrl: tab.url,
          };

          return { ...record, extraData };
        }
        return undefined;
      }))
      .pipe(skip(1)) // get only future activity
      .pipe(filter(x => Boolean(x)))
      .pipe(distinctUntilChanged(
        (before?: ResourceRecord, after?: ResourceRecord) => {
          if (before && after) return before.resourceId === after.resourceId;
          return !before && !after;
        }
      ))
  );

  subscriptions.set(
    sdk.activity.id,
    // @ts-ignore : RxJS module resolution doesn't works with linked modules (dev env)
    sdk.tabs.nav()
      .pipe(switchMap(nav => observeCurrentTabNextResource(nav.tabId)))
      .subscribe((record: ResourceRecord) => {
        sdk.activity.push(record.resourceId, record.extraData, record.type, manifestURL);
      })
  );

  return EMPTY;
};

export const stopActivityRecording = (sdk: SDK) => {
  if (subscriptions.has(sdk.activity.id)) {
    subscriptions.get(sdk.activity.id)!.unsubscribe();
  }
};
