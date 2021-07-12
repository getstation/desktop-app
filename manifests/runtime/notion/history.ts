import { activity, SDK } from '@getstation/sdk';
import { compact } from 'ramda-adjunct';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { getDeepResourceId } from './activity';
import { getResource } from './gateway/api';
import { stripUuid } from './gateway/helpers';
import {
  fetchPage,
  fetchPublicPageFromBlockId,
} from './gateway/methods';
import {
  pageInfos,
  publicPageToWorkspace,
} from './gateway/transformer';
import { asSearchItem } from './helpers';
import { serviceName } from './main';

let activitySubscription: Subscription | undefined;

export const startHistoryRecording = (sdk: SDK): Observable<Error> => {
  // @ts-ignore
  activitySubscription = sdk.activity
    .query({ limit: 10, global: true, where: { manifestURLs: [sdk.activity.id] } })
    .subscribe(async (activityEntries: activity.ActivityEntry[]) => {
      const historyEntries = await Promise.all(
        activityEntries.map(
          async (entry) => {
            const resourceId = getDeepResourceId(entry);
            if (!resourceId || entry.extraData.silent) return undefined;
            const page = await getResource(resourceId, fetchPage, pageInfos, sdk);
            const { name, domain } = await getResource(page.id, fetchPublicPageFromBlockId, publicPageToWorkspace, sdk);
            return {
              ...asSearchItem(name, domain, stripUuid(page.id), page.label, sdk),
              context: `${serviceName} > ${name}`,
              date: new Date(entry.createdAt),
            };
          })
      );
      sdk.history.entries.next(compact(historyEntries));
    });

  return EMPTY;
};

export const stopHistoryRecording = () => {
  if (activitySubscription) {
    activitySubscription.unsubscribe();
    activitySubscription = undefined;
  }
};
