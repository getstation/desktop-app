import * as Immutable from 'immutable';
// @ts-ignore: no declaration file
import * as median from 'median';
// @ts-ignore: no declaration file
import * as moment from 'moment';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { getApplications, getApplicationsWithoutInternals } from '../applications/selectors';
import { removeHashFromURL } from '../tab-webcontents/api';
import { RecursiveImmutableList, RecursiveImmutableMap, StationState } from '../types';
import { getLastActivityAt, getTabApplicationId, getTabId, getTabIsApplicationHome, getTabURL, isIgnoredForBackHistory } from './get';
import { StationTab, StationTabImmutable, StationTabsImmutable } from './types';
import { getSubwindows } from '../subwindows/selectors';
import { hasSubwindowsTabId } from '../subwindows/get';
import { getApplicationId } from '../applications/get';

export const getTabs = (state: StationState): StationTabsImmutable =>
  state.get('tabs');

/**
 * Returns a Map:
 * - Keys are untouched URLs
 * - Values are `StationTabImmutable`
 */
export const getTabsMappedByExactURL = createSelector(
  getTabs,
  tabs =>
    tabs.filter(tab => typeof getTabURL(tab) === 'string')
      .mapKeys((_k, tab) => getTabURL(tab))
);

/**
 * Returns a Map:
 * - Keys are stripped URLs (everything before `#` char)
 * - Values are `StationTabImmutable`
 */
export const getTabsMappedByLooseURL = createSelector(
  getTabsMappedByExactURL,
  tabs => tabs.mapKeys(removeHashFromURL)
);

// We had some bug while testing the sortBy a way back.
// We can't reproduce it anymore, but here is what we did to fix it anyway:
// https://github.com/getstation/browserX/pull/484/commits/8c6680e3e3d5a8d9723f70cc2d302d64e41ffca2#diff-d3490afa09df7774e88088689177e952R25
export const getTabsSortedByLastActivityAt = createSelector(
  getTabs,
  tabs => tabs
    .toList()
    .sortBy((tab: StationTabImmutable) =>
      tab.get('lastActivityAt', 0))
);

export const getTabById = (state: StationState, tabId: string) =>
  getTabs(state).get(tabId);

export const getTabsForApplication = createCachedSelector(
  [getTabs, getSubwindows, (_state: StationState, applicationId: string) => applicationId],
  (tabs, subwindows, applicationId) => tabs
    .filter(t => getTabApplicationId(t) === applicationId)
    .map(tab => tab.set('isDetached', hasSubwindowsTabId(subwindows as any, getTabId(tab))))
)((_state: StationState, applicationId) => applicationId);

/**
 * Returns a tab matching given URL, with the way it has been matched:
 * type: 'exact' means exact match, 'loose' means match with stripped URLs
 */
export const getTabMatchingURL = (state: StationState, url: string): { type: 'exact' | 'loose', tab: StationTabImmutable } | null => {
  const exactMatch = getTabsMappedByExactURL(state).get(url);
  if (exactMatch) {
    return {
      type: 'exact',
      tab: exactMatch,
    };
  }
  const looseMatch = getTabsMappedByLooseURL(state).get(removeHashFromURL(url));
  if (looseMatch) {
    return {
      type: 'loose',
      tab: looseMatch,
    };
  }
  return null;
};

export const getTabIdMatchingURL = (state: StationState, url: string): { type: 'exact' | 'loose', tabId: string } | null => {
  const match = getTabMatchingURL(state, url);
  return match ? {
    type: match.type,
    tabId: getTabId(match.tab),
  } : null;
};

export const getApplicationIdByTabId = (state: StationState, tabId: string) => {
  const tab = getTabById(state, tabId);
  if (!tab) return;

  return getTabApplicationId(tab);
};

export const getApplicationByTabId = createCachedSelector(
  getTabs,
  getApplications,
  (_state: StationState, tabId: string) => tabId,
  (tabs, applications, tabId) => {
    const tab = tabs.get(tabId);
    if (!tab) return null;
    return applications.get(getTabApplicationId(tab));
  }
)((_state: StationState, tabId: string) => tabId);

export const getTabIdsByApplicationId = (state: StationState, applicationId: string) => {
  return getTabs(state)
    .filter(tab => getTabApplicationId(tab) === applicationId)
    .map(tab => getTabId(tab))
    .toArray();
};

export const getDuplicateTabsByURL = createSelector(
  getTabs, getTabsMappedByExactURL,
  (tabs, tabsByURL) => {
    const filteredTabs = tabs.filter(tab => typeof getTabURL(tab) === 'string');

    let result: RecursiveImmutableMap<Record<string, StationTab[]>> = Immutable.Map<string, any>() as any;

    tabsByURL.mapKeys((url: string) => {
      const tabsWithSameURL = filteredTabs.filter(tab => getTabURL(tab) === url);
      result = result.set(url, tabsWithSameURL.toList());
    });

    return result.filter(t => t.size > 1);
  }
);

export const getDuplicateTabsByURLFilteredByApplicationId = createCachedSelector(
  getDuplicateTabsByURL, (_state: StationState, applicationId: string) => applicationId,
  (tabsGroupedByURL, applicationId) => tabsGroupedByURL
    .filter(tabs => tabs.every(tab => getTabApplicationId(tab) === applicationId))
)((_state: StationState, applicationId) => applicationId);

export const getDuplicatedTabsCountByURL = createCachedSelector(
  getDuplicateTabsByURLFilteredByApplicationId,
  tabsGroupedByURL => tabsGroupedByURL
    .flatten(true)
    .toList()
    .countBy(tab => tab.get('url'))
    .reduce((accumulator: number, value: number) => accumulator + value - 1, 0)
)((_state: StationState, applicationId) => applicationId);

export const getDuplicatedTabsCountByTitle = createCachedSelector(
  getDuplicateTabsByURLFilteredByApplicationId,
  tabsGroupedByURL => tabsGroupedByURL
    .flatten(true)
    .toList()
    .countBy(tab => tab.get('title'))
    .reduce((accumulator: number, value: number) => accumulator + value - 1, 0)
)((_state: StationState, applicationId) => applicationId);

export const getTabInactivityTimesInDays = createCachedSelector(
  getTabsSortedByLastActivityAt, (_state: StationState, applicationId: string) => applicationId,
  (tabsSorted: RecursiveImmutableList<StationTab[]>, applicationId) =>
    tabsSorted
      .filter(tab => getTabApplicationId(tab) === applicationId)
      .map(tab => getLastActivityAt(tab))
      .map(lastActivityAt => moment().diff(moment(lastActivityAt), 'days'))
      .toJS()
)((_state: StationState, applicationId) => applicationId);

export const getMaxTabInactivityTimeInDays = createCachedSelector(
  getTabInactivityTimesInDays,
  tabsInactivity => Math.max(...tabsInactivity)
)((_state: StationState, applicationId) => applicationId);

export const getMedianTabInactivityTimeInDays = createCachedSelector(
  getTabInactivityTimesInDays,
  tabsInactivity => median(tabsInactivity)
)((_state: StationState, applicationId) => applicationId);

export const getHomeTabsWithApplications = createSelector(
  getTabs, getApplications,
  (tabs, applications) => tabs
    .filter(
      (tab: StationTabImmutable) =>
        applications.has(getTabApplicationId(tab)) &&
        getTabIsApplicationHome(tab)
    )
    .map(tab => [tab, applications.get(getTabApplicationId(tab))])
    .toList()
);

export const getTabsOnlyWithApplications = createSelector(
  [getTabs, getApplications],
  (tabs, applications) => tabs
    .filter(
      (tab: StationTabImmutable) =>
        applications.has(getTabApplicationId(tab)) &&
        !getTabIsApplicationHome(tab)
    )
    .map(tab => [tab, applications.get(getTabApplicationId(tab))])
    .toList()
);
