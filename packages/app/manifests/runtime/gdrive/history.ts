import { activity, history, SDK } from '@getstation/sdk';
import { HistoryConsumer } from '@getstation/sdk/lib/history/consumer';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { getIconPath } from '../helpers';
import { getDeepResourceId } from './activity';
import { ElectronGDriveOAuth2, getGDriveFileAsSearchResult } from './helpers';

const subscriptions = new Map<Credentials, Subscription>();

const iconId = 'gdrive';

export const startHistoryRecording = (sdk: SDK, client: ElectronGDriveOAuth2, token: Credentials, email?: string): Observable<Error> => {
  const manifestURL = sdk.storage.id;
  if (!Boolean(sdk.history)) {
    sdk.register(new HistoryConsumer(manifestURL));
  }
  // @ts-ignore : RxJS module resolution doesn't works with linked modules
  const subscription = sdk.activity
    .query({ limit: 10, global: true, where: { manifestURLs: [sdk.activity.id] } })
    .subscribe(async (activityEntries: activity.ActivityEntry[]) => {
      const resultsAsHistoryEntries: history.HistoryEntry[] = [];

      for (const entry of activityEntries) {
        const homeTab = sdk.tabs.getTabs().find(t => t.isApplicationHome && t.tabId === entry.resourceId);
        const resourceId = getDeepResourceId(entry);
        if (entry.type === 'nav-to-tab' && !homeTab && resourceId) {
          try {
            const file = await client.getFile(resourceId);
            if (file) {
              resultsAsHistoryEntries.push({
                ...getGDriveFileAsSearchResult(sdk, file, email),
                date: new Date(entry.createdAt),
              });
            }
          } catch (e) {
            console.error(e);
          }
        } else if (entry.type === 'nav-to-tab' && homeTab) {
          resultsAsHistoryEntries.push({
            resourceId: homeTab.tabId,
            category: 'Google Drive',
            label: homeTab.title,
            context: email,
            imgUrl: getIconPath(iconId),
            manifestURL: sdk.activity.id,
            onSelect: () => sdk.tabs.navToTab(homeTab.tabId),
            url: homeTab.url,
            date: new Date(entry.createdAt),
          });
        }
      }

      sdk.history.entries.next(resultsAsHistoryEntries);
    });

  // @ts-ignore : RxJS module resolution doesn't works with linked modules
  subscriptions.set(token, subscription);

  return EMPTY;
};

export const stopHistoryRecording = (sdk: SDK, token?: Credentials) => {
  if (Boolean(token)) {
    subscriptions.get(token!)!.unsubscribe();
    subscriptions.delete(token!);

    if (subscriptions.size === 0) {
      sdk.unregister(sdk.history);
    }
  } else {
    subscriptions.forEach(s => s.unsubscribe());
    subscriptions.clear();
    sdk.unregister(sdk.history);
  }
};
