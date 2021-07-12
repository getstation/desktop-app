import { activity, history, SDK } from '@getstation/sdk';
import { map, pipe, prop, uniqBy } from 'ramda';
import { compact } from 'ramda-adjunct';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { getDeepResourceId } from './activity';
import SlackSearch from './search';

let activitySubscription: Subscription | undefined;

const getHistoryItem = async (
  item: activity.ActivityEntry
): Promise<history.HistoryEntry | undefined> => {
  if (item.extraData.silent) return;
  // silent activity (i.e. not triggered by the end user)
  // should not be in history

  const team = item.extraData.teamId ?
    await SlackSearch.getTeam(item.extraData.teamId) :
    await SlackSearch.findTeamByDomain(item.extraData.domain);

  if (!team) return;

  const resourceId = getDeepResourceId(item);

  if (!resourceId) return;

  const entry = team.get(resourceId);

  if (!entry) return;

  if (!Boolean(entry)) return undefined;

  return {
    ...entry,
    date: new Date(item.createdAt),
    url: item.extraData.tabUrl,
  };
};

export const startHistoryRecording = async (sdk: SDK): Promise<Observable<Error>> => {
  // @ts-ignore
  activitySubscription = sdk.activity
    .query({
      limit: 10,
      global: true,
      where: { manifestURLs: [sdk.activity.id] },
    })
    .subscribe(async (activityEntries: activity.ActivityEntry[]) => {
      const historyEntries = await Promise.all(
        pipe(
          compact,
          // TODO: should be done in sdk activity provider (via the query)
          uniqBy(prop('resourceId')),
          map(getHistoryItem)
        )(activityEntries)
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
