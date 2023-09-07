import { activity, history } from '@getstation/sdk';
import { HistoryConsumer } from '@getstation/sdk/lib/history/consumer';
import { compact } from 'ramda-adjunct';
import { SagaIterator } from 'redux-saga';
import { all, call, fork, put, select, take, getContext } from 'redux-saga/effects';
import { asyncScheduler, combineLatest, from } from 'rxjs';
import { distinctUntilChanged, observeOn, switchMap, map } from 'rxjs/operators';

import { BrowserXAppWorker } from '../app-worker';
import { getApplicationManifestURL } from '../applications/get';
import { tabAsActivityEntry } from '../activity/helpers';
import { serializeResults } from '../bang/api';
import { organizeHistoryResults } from '../bang/helpers/organizeSearchResults';
import { callbacksHistory } from '../bang/sagas';
import { isActiveConsumer } from '../sdk/api';
import sdk, { defaultClientOptions } from '../sdk/default-client';
import bxSDK from '../sdk/index';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { getTabId } from '../tabs/get';
import { getApplicationByTabId, getTabs } from '../tabs/selectors';
import { StationTabsImmutable } from '../tabs/types';
import { StationState } from '../types';
import { observableChannel, takeEveryWitness } from '../utils/sagas';
import { historyItemsAsLastUsedSection } from './api';
import { setHistoryItems } from './duck';

function* sdkHistoryProvider(): SagaIterator {
  const providerHistory$ = bxSDK
    .history
    .provider
    .entries
    .pipe(observeOn(asyncScheduler));

  const providerHistoryChannel = observableChannel(providerHistory$);

  yield takeEveryWitness(
    providerHistoryChannel,
    function* (entries: history.HistoryEntry[]) {
      const historySectionSerialized = yield call(
        serializeResults,
        [historyItemsAsLastUsedSection(entries)],
        callbacksHistory
      );

      const organizedHistorySectionSerialized = yield call(organizeHistoryResults, historySectionSerialized);

      yield put(setHistoryItems(organizedHistorySectionSerialized[0].results));
    }
  );
}

function* sdkHistoryAppConsumer({ store }: BrowserXAppWorker): SagaIterator {
  yield take(REHYDRATION_COMPLETE);

  const defaultConsumer = new HistoryConsumer(defaultClientOptions.id);

  sdk.register(defaultConsumer);

  const activityQuery$ = bxSDK
    .history
    .provider
    .consumersObservable
    .pipe(switchMap(consumers => sdk
      .activity
      .query({
        limit: 50,
        where: {
          types: 'nav-to-tab',
        },
        whereNot: {
          manifestURLs: consumers
            .map(c => c.id)
            .filter(id => id !== defaultConsumer.id),
        },
      })
      .pipe(
        distinctUntilChanged()
      )
    ));

  // @ts-ignore
  const tabs$ = from(store)
    .pipe(
      map((s: StationState) => getTabs(s)),
      distinctUntilChanged()
    );

  const activityWithTabs$ = combineLatest(activityQuery$, tabs$);
  const activityWithTabsChannel = observableChannel(activityWithTabs$);

  yield takeEveryWitness(
    activityWithTabsChannel,
    function* (activityWithTabs: [activity.ActivityEntry[], StationTabsImmutable]) {
      const [activities, tabs] = activityWithTabs;

      const entries = yield all(activities
        .map(
          function* ({ resourceId, createdAt, manifestURL }: activity.ActivityEntry) {
            const activeConsumer = manifestURL && isActiveConsumer('history', manifestURL, bxSDK);
            if (activeConsumer) return undefined;

            const tab = tabs.find(t => getTabId(t) === resourceId);
            if (!tab) return undefined;

            const application = yield select(getApplicationByTabId, getTabId(tab));
            if (!application) return undefined;

            const { manifestProvider }: BrowserXAppWorker = yield getContext('bxApp');
            const { manifest } = yield manifestProvider.getFirstValue(getApplicationManifestURL(application));

            return {
              ...tabAsActivityEntry(tab, application, manifest, yield select()),
              date: new Date(createdAt),
            };
          }
        )
      );

      sdk.history.entries.next(compact(entries));
    }
  );
}

export default function* main(bxApp: BrowserXAppWorker) {
  yield all([
    fork(sdkHistoryProvider),
    fork(sdkHistoryAppConsumer, bxApp),
  ]);
}
