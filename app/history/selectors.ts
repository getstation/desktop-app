import { createSelector } from 'reselect';
import { StationHistoryImmutable, StationHistoryItemImmutable } from './get';

import { StationState } from '../types';

export const getHistory = (state: StationState): StationHistoryImmutable =>
  state.get('history');

export const getHistoryItems = createSelector(
  getHistory, history => history.get('items')
);

// predicate creator
const byResourceId = (id: string) => (item: StationHistoryItemImmutable): boolean =>
  Boolean(item && item.get('resourceId') === id);

export const getHistoryItem = (state: StationState, historyActivityId: string): StationHistoryItemImmutable | undefined => {
  return getHistoryItems(state).find(byResourceId(historyActivityId));
};
