import * as Immutable from 'immutable';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { getApplicationId } from '../applications/get';
import { getApplications, getBadgeForApplication } from '../applications/selectors';
import { ApplicationImmutable, StationApplication } from '../applications/types';
import { getOrderedFavoritesForApplicationId } from '../ordered-favorites/selectors';
import { getOrderedTabsForApplicationId } from '../ordered-tabs/selectors';
import { getTabsForApplication } from '../tabs/selectors';
import { StationState } from '../types';
import { getLastActivityAt, getTabIsApplicationHome, getTabFavoriteId } from '../tabs/get';

export const getDock = (state: StationState) => state.get('dock');

export const getTabsAndFavoritesForApplication = createCachedSelector(
  [getOrderedTabsForApplicationId, getOrderedFavoritesForApplicationId, getTabsForApplication],
  (orderedTabs, orderedFavorites, tabs) => {
    const homeTab = tabs.find(tab => tab.get('isApplicationHome'));

    return Immutable.List([homeTab])
      .concat(orderedFavorites)
      .concat(orderedTabs)
      .filter(Boolean);
  }
)(
  /*
   * Re-reselect resolver function.
   * Cache/call a new selector for each different "applicationId"
   */
  (_state, applicationId) => applicationId
);

export const getRecentTabsAndFavoritesForApplication = createCachedSelector(
  getTabsAndFavoritesForApplication,
  (_state: StationState, _applicationId: StationApplication['applicationId'], activityBefore: number) => activityBefore,
  (tabsAndFavorites, activityBefore) => {
    return tabsAndFavorites.filter(
      t => getTabIsApplicationHome(t) || Boolean(getTabFavoriteId(t)) || (getLastActivityAt(t)! > activityBefore)
    );
  }
)(
  (_state, applicationId, activityBefore) =>
    `${applicationId}-${activityBefore}`
);

export const getFirstApplicationIdInDock = (state: StationState) => state.get('dock').first();

export const getApplicationsForDock = createSelector([getDock, getApplications, getBadgeForApplication],
  (dock, applications, badgeForApplication) => dock
    .toOrderedSet()
    .map((appId: string) => applications.get(appId))
    .filter(application => Boolean(application))
    .map((application: ApplicationImmutable) => {
      const badge = badgeForApplication(getApplicationId(application));
      const extendedAttrs = { badge };
      if (!application) return;
      return application.merge(Immutable.Map(extendedAttrs));
    })
    .toList()
);
