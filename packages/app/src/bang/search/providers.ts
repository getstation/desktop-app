import * as path from 'path';
import { take } from 'rxjs/operators';
import { LocalStorage } from 'node-localstorage';
import * as remote from '@electron/remote';
import * as moment from 'moment';
import { reverse } from 'ramda';
import { SDK, activity } from '@getstation/sdk';

import { FrecencyStorageProvider } from './score';
import { SearchEngine } from './types';

/**
 * Utility function to save an activity entry as a global selection with the given `SearchEngine`
 */
const saveGlobalSelection = (searchEngine: SearchEngine, entry: activity.ActivityEntry) => {
  const extraData = entry.extraData || {};

  if (!extraData.silent) {
    const { resourceId, createdAt } = entry;
    const dateSelection = new Date(createdAt);
    searchEngine.saveGlobalSelection(resourceId, dateSelection);
  }
};

/**
 * This function is called by a saga when a `REHYDRATATION_COMPLETE` action occurs.
 *
 * it take cares of getting 15 days old activiy entries + all new activity using the activity api in the sdk
 * then, it use the `SearchEngine` to save entries as global selection.
 *
 * it allows the the global frecency engine to compute scores.
 */
export const feedGlobalFrecencyStorage = async (searchEngine: SearchEngine, sdk: SDK) => {
  const allEntries$ = sdk.activity.query({
    // we only want activities that are 15 days old
    // this prevent bx to overload at start
    limitByDate: moment().subtract(15, 'days').valueOf(),
    limit: 5000, // additional overload protection at bx start
    global: true, // all activities, unregarding consumer id
    ascending: false, // we want the most recent activities
  });

  // the global frecency algortihm need to be fed with `ascending` entries but the query we made is `descending`,
  // so that's why we `reverse(entries)`
  const descendingEntries = await allEntries$.pipe(take(1)).toPromise();
  const ascendingEntries = reverse(descendingEntries);

  for (const entry of ascendingEntries) {
    saveGlobalSelection(searchEngine, entry);
  }

  const nextEntries$ = sdk.activity.query({
    limit: 1,
    global: true,
    ascending: false,
  });

  return nextEntries$.subscribe(([entry]) => {
    saveGlobalSelection(searchEngine, entry);
  });
};

type ClearCacheFunction = () => void;

/**
 * used by global frecency
 */
export const createInMemoryStorageProvider = (): FrecencyStorageProvider & { clearCache: ClearCacheFunction } => {
  let cache: Record<string, string> = {};

  return {
    getItem: (key) => cache[key] || null,
    setItem: (key, value) => { cache[key] = value; },
    clearCache: () => { cache = {}; },
  };
};

export const createContextualFrecencyStorageProvider = () => {
  const userDataPath = remote.app.getPath('userData');
  const storageProviderPath = path.join(userDataPath, 'frecencyDataStorage');
  return new LocalStorage(storageProviderPath);
};
