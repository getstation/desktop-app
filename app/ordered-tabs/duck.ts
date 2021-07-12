import { filter } from 'ramda';
import * as Immutable from 'immutable';
import {
  StationAllOrderedTabsImmutable,
  StationOrderedTabsImmutable,
} from './types';

export const PUSH_TAB = 'browserX/ordered-tabs/PUSH_TAB';
export type PUSH_TAB = 'browserX/ordered-tabs/PUSH_TAB';
export const REMOVE_TAB = 'browserX/ordered-tabs/REMOVE_TAB';
export type REMOVE_TAB = 'browserX/ordered-tabs/REMOVE_TAB';
export const REORDER_TAB = 'browserX/ordered-tabs/REORDER_TAB';
export type REORDER_TAB = typeof REORDER_TAB;

export type PushTabAction = { type: PUSH_TAB, applicationId: string, tabId: string };
export type DeleteTabAction = { type: REMOVE_TAB, applicationId: string, tabId: string };
export type ReorderTabAction = { type: REORDER_TAB, tabId: string, newPosition: number };

export type OrderedTabsActions = PushTabAction | DeleteTabAction | ReorderTabAction;

export const pushTab = (applicationId: string, tabId: string): PushTabAction => ({
  type: PUSH_TAB,
  applicationId,
  tabId,
});

export const removeTab = (applicationId: string, tabId: string): DeleteTabAction => ({
  type: REMOVE_TAB,
  applicationId,
  tabId,
});

export const reorderTab = (tabId: string, newPosition: number): ReorderTabAction => ({
  type: REORDER_TAB,
  tabId,
  newPosition,
});

const getApplicationIdFromTabId = (state: StationAllOrderedTabsImmutable, tabId: string): string | undefined => {
  const entry = state
    .find(app =>
      app.get('order')
        .find((id: string) => id === tabId)
    );
  if (!entry) return undefined;
  return entry.get('applicationId');
};

export default function orderedTabsReducer(
  state: StationAllOrderedTabsImmutable = Immutable.Map() as any,
  action: OrderedTabsActions,
): StationAllOrderedTabsImmutable {
  switch (action.type) {
    case PUSH_TAB: {
      const { tabId, applicationId } = action;

      // push tabId to the top of the list
      const nextOrder = Immutable.List([tabId]).concat(state.getIn([applicationId, 'order'], []));

      return state.set(
        applicationId,
        Immutable.Map({
          applicationId,
          order: nextOrder,
        }) as any,
      );
    }

    case REMOVE_TAB: {
      const { tabId } = action;
      return state
        .map((tabs: StationOrderedTabsImmutable) =>
          tabs.update('order', filter(id => id !== tabId)) as any
        ) // remove corresponding tabId
        .filter((tabs: StationOrderedTabsImmutable) => // remove application ordered tabs object when empty
          tabs.get('order').size > 0 as any
        );
    }

    case REORDER_TAB: {
      const { tabId, newPosition } = action;
      const applicationId = getApplicationIdFromTabId(state, tabId);

      if (!applicationId) return state;
      const order = state.getIn([applicationId, 'order']);
      const position = order.findIndex((id: string) => tabId === id);
      const newOrder = order.delete(position).insert(newPosition, order.get(position));
      return state.setIn([applicationId, 'order'], newOrder as any);
    }

    default:
      return state;
  }
}
