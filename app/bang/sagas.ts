// @ts-ignore: no declaration file
import { search, activity, SDK } from '@getstation/sdk';
import { observeOn, distinctUntilChanged, timestamp } from 'rxjs/operators';
import * as log from 'electron-log';
import isEmpty = require('is-empty');
import { SagaIterator } from 'redux-saga';
import { delay } from 'redux-saga/effects';
import { all, call, fork, put, select, getContext } from 'redux-saga/effects';
import { Selector } from 'reselect';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import { flatten, uniqBy } from 'ramda';
import { noop } from 'ramda-adjunct';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { asyncScheduler } from 'rxjs';
import { dispatchUrl } from '../applications/duck';
import { historyItemsAsLastUsedSection } from '../history/api';
import bxSDK from '../sdk';
import sdk from '../sdk/default-client';
import { SearchSection } from '../sdk/search/types';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { Pair } from '../utils/fp';
import { observableChannel, takeEveryWitness, takeLatestWitness } from '../utils/sagas';
import { CallbacksStore, EMPTY_SECTION, flattenResults, getSelectionCallback, serializeResults, SectionKinds } from './api';
import {
  CYCLING_STEP,
  CyclingStepAction,
  SearchResultSerialized,
  SearchSectionSerialized,
  SELECT_ITEM,
  SelectItemAction,
  SET_SEARCH_VALUE,
  SET_VISIBILITY,
  setInsertVisibility,
  setSearchResults,
  setSearchValue,
  SetSearchValueAction,
  setVisibility,
  SetVisibilityAction,
  TOGGLE_VISIBILITY,
  ToggleVisibilityAction,
} from './duck';
import { organizeSearchResults } from './helpers/organizeSearchResults';
import { getId } from './helpers/utils';
import createBxSearchEngine, { feedGlobalFrecencyStorage } from './search';
import { isVisible } from './selectors';
import { getApplicationManifestURL } from '../applications/get';
import { tabAsActivityEntry, favoriteAsActivityEntry } from '../activity/helpers';
import { BrowserXAppWorker } from '../app-worker';
import { createFuseSearch } from './helpers/fuse';
import { getHomeTabsWithApplications, getTabsOnlyWithApplications } from '../tabs/selectors';
import { ActivityEntry } from '../activity/types';
import { getHistoryItems } from '../history/selectors';
import { getFavoritesWithApplications } from '../favorites/selectors';
import { StationState } from '../types';

const TOP_HITS_ITEMS = 3;

const bxSearchEngine = createBxSearchEngine();

export const callbacksHistory: CallbacksStore = new Map();
export const callbacksSearch: CallbacksStore = new Map();

function* toggleVisibilitySaga({ format, via }: ToggleVisibilityAction): SagaIterator {
  const visible = yield select(isVisible);
  yield put(setVisibility(format, !visible, via!));
}

function* sdkQueryValueEmitter(action: SetSearchValueAction): SagaIterator {
  log.debug('[bang] sdkQueryValueEmitter', action.searchValue);
  bxSDK.search.provider.query.next({ value: action.searchValue });
}

function* hideDiscoverabilityInsert({ searchValue }: SetSearchValueAction): SagaIterator {
  if (searchValue.length > 0) {
    yield put(setInsertVisibility(false));
  }
}

function* produceResults(providerResults: Timestamp<SearchSection[]>, query: Timestamp<search.SearchQuery>):
  SagaIterator {
  // TODO find a way to pipe this instead of putting it there
  const serializedResults: SearchSectionSerialized[] = yield call(serializeResults, providerResults.value, callbacksSearch);
  const flattenedResults = flattenResults(serializedResults);
  const resultsSyncedWithQuery = (providerResults.timestamp - query.timestamp) > -1;

  if (resultsSyncedWithQuery) {
    const topHitsResults: search.SearchResultItem[] = bxSearchEngine.search(flattenedResults, { query: query.value.value }, TOP_HITS_ITEMS);

    const topHits = {
      sectionKind: 'top-hits',
      sectionName: EMPTY_SECTION,
      results: topHitsResults.map((result: SearchResultSerialized) => ({ ...result, sectionKind: 'top-hits' })),
    };

    return yield call(organizeSearchResults, [topHits, ...serializedResults]);
  }

  return yield call(organizeSearchResults, serializedResults);
}

function* sdkSearchProvider(computedResults$: Subject<Pair<SearchSectionSerialized[]>>): SagaIterator {
  const providerResults$ = bxSDK
    .search
    .provider
    .results
    .pipe(observeOn(asyncScheduler), timestamp());

  const query$ = bxSDK
    .search
    .provider
    .query
    .pipe(distinctUntilChanged(), timestamp());

  const providerResultsWithQuery$ = combineLatest(providerResults$, query$);
  const providerResultsWithQueryChannel = observableChannel(providerResultsWithQuery$);

  yield takeEveryWitness(
    providerResultsWithQueryChannel,
    function* (providerResultsWithQuery: [Timestamp<SearchSection[]>, Timestamp<search.SearchQuery>]) {
      const sections: SearchSectionSerialized[] = yield call(produceResults, providerResultsWithQuery[0], providerResultsWithQuery[1]);
      const historyItems = yield select(getHistoryItems);
      const historySection = yield call(historyItemsAsLastUsedSection, historyItems.toJS());

      yield put(setSearchResults(sections));
      yield call([computedResults$, computedResults$.next], [sections, [historySection]]);
    }
  );
}

function* getActivityEntries(): SagaIterator {
  const { manifestProvider }: BrowserXAppWorker = yield getContext('bxApp');

  function* asEntries(
    selector: Selector<StationState, any>,
    converter: Function
  ) {
    const tabsWithApps = yield select(selector);
    const entries: ActivityEntry[] = [];

    for (const [tab, application] of tabsWithApps) {
      const { manifest } = yield manifestProvider.getFirstValue(
        getApplicationManifestURL(application)
      );

      entries.push(
        converter(
          tab, application, manifest, yield select()
        )
      );
    }

    return entries;
  }

  const allEntries: ActivityEntry[][] = yield all([
    call(asEntries, getHomeTabsWithApplications, tabAsActivityEntry),
    call(asEntries, getTabsOnlyWithApplications, tabAsActivityEntry),
    call(asEntries, getFavoritesWithApplications, favoriteAsActivityEntry),
  ]);

  return uniqBy((x: ActivityEntry) => x.resourceId)(flatten(allEntries));
}

function* appsSearchConsumer(): SagaIterator {
  let cancelRunningQuery: () => void = noop;

  // consumer.on('query') -> compute results -> send results to provider
  const queryChannel = observableChannel(sdk.search.query.pipe(distinctUntilChanged()));
  yield takeEveryWitness(
    queryChannel,
    function* ({ value }: search.SearchQuery) {
      sdk.search.results.next({ loading: SectionKinds.getCategory('apps') });

      cancelRunningQuery();
      let cancelled = false;
      cancelRunningQuery = () => { cancelled = true; };

      log.debug('[bang] sdkSearchConsumer.query', value);

      const activityEntries: ActivityEntry[] = yield call(getActivityEntries);
      const searchEntries: ReturnType<typeof createFuseSearch> = yield call(createFuseSearch, activityEntries);

      if (cancelled) return;

      const { results } = searchEntries(value);
      sdk.search.results.next({ results });
    });
}

function* onSelectItem(action: SelectItemAction): SagaIterator {
  const { item: { resourceId, onSelect, url }, searchValue, format } = action;
  const callbacksStores = new Map([...callbacksHistory, ...callbacksSearch]);

  const isBangVisible = yield select(isVisible);

  if (!isEmpty(searchValue)) {
    bxSearchEngine.saveContextualSelection({
      searchQuery: searchValue,
      selectedId: resourceId,
    });
  }

  if (isBangVisible) {
    yield put(setVisibility(format, false, 'item-selected'));
    yield delay(300);
  }

  if (onSelect) {
    const onSelectCallback = getSelectionCallback(callbacksStores, resourceId);
    try {
      yield call(onSelectCallback);
    } catch (_) {
      if (url) {
        yield put(dispatchUrl(url));
      }
    }
  } else if (url) {
    yield put(dispatchUrl(url));
  } else {
    throw new Error('Item URL missing');
  }
}

function* onCyclingStep({ item, format }: CyclingStepAction): SagaIterator {
  if (format === 'subdock') {
    yield put(updateUI('recentSubdock', 'highlightedItemId', getId(item)));
  } else {
    yield put(updateUI('qs', 'highlightedItemId', getId(item)));
  }
}

function* resetQueryOnBangHide({ visible, format }: SetVisibilityAction): SagaIterator {
  if (!visible && format === 'center-modal') {
    yield delay(300); // workaround: wait for the bang to close completely
    yield put(setSearchValue(''));
  }
}

/* This is a workaround to trigger `Search Results Shown` tracking event */
function* resetQueryOnBangShow({ visible, format }: SetVisibilityAction): SagaIterator {
  if (visible && format === 'center-modal') {
    yield put(setSearchValue(''));
  }
}

export default function* main() {
  const computedResults$: Subject<Pair<SearchSectionSerialized[]>> = new Subject();
  let feedGlobalFrecencyStorageSubscription: Subscription | null = null;

  yield all([
    takeEveryWitness(REHYDRATION_COMPLETE, function* () {
      if (feedGlobalFrecencyStorageSubscription) {
        feedGlobalFrecencyStorageSubscription.unsubscribe();
      }

      feedGlobalFrecencyStorageSubscription = yield call(feedGlobalFrecencyStorage, bxSearchEngine, sdk);
    }),
    takeEveryWitness(TOGGLE_VISIBILITY, toggleVisibilitySaga),
    takeEveryWitness(SELECT_ITEM, onSelectItem),
    takeEveryWitness(CYCLING_STEP, onCyclingStep),
    takeLatestWitness(SET_SEARCH_VALUE, sdkQueryValueEmitter),
    takeLatestWitness(SET_SEARCH_VALUE, hideDiscoverabilityInsert),
    takeEveryWitness(REHYDRATION_COMPLETE, appsSearchConsumer),
    takeEveryWitness(SET_VISIBILITY, resetQueryOnBangHide),
    takeEveryWitness(SET_VISIBILITY, resetQueryOnBangShow),
    fork(sdkSearchProvider, computedResults$),
  ]);
}
