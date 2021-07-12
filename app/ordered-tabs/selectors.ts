import * as Immutable from 'immutable';
import createCachedSelector from 're-reselect';
import { getTabId } from '../tabs/get';
import { getTabsForApplication } from '../tabs/selectors';
import { StationState } from '../types';

const getOrderedTabsIdsForApplication = (state: StationState, applicationId: string) =>
  state.getIn(['orderedTabs', applicationId, 'order'], Immutable.List([]) as any);

export const getOrderedTabsForApplicationId = createCachedSelector(
  [getTabsForApplication, getOrderedTabsIdsForApplication],
  (tabs, orderedTabs) => {

    return orderedTabs.map(tabId => tabs.get(tabId))
      .filter((tab: any) => Boolean(tab))
      .map((tab: any) =>
        tab.set('id', `${getTabId(tab) || 'none'}_${tab.get('favoriteId') || 'none'}`)
      );
  }
)(
  /*
   * Re-reselect resolver function.
   * Cache/call a new selector for each different "applicationId"
   */
  (_state, applicationId) => applicationId
);
