import * as Immutable from 'immutable';
import { StationNavImmutable } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Constants

export type CHANGE_SELECTED_APP_MAIN = 'browserX/nav/CHANGE_SELECTED_APP_MAIN';
export const CHANGE_SELECTED_APP_MAIN = 'browserX/nav/CHANGE_SELECTED_APP_MAIN';

// Action Types

export type ChangeSelectedAppMain = { type: CHANGE_SELECTED_APP_MAIN, applicationId: string };
export type navActions = ChangeSelectedAppMain;

// Action creators

export const changeSelectedAppMain = (applicationId: string): ChangeSelectedAppMain =>
  ({ type: CHANGE_SELECTED_APP_MAIN, applicationId });

// Reducer

export default function nav(state: StationNavImmutable = Immutable.Map() as any, action: navActions): StationNavImmutable {
  switch (action.type) {

    case CHANGE_SELECTED_APP_MAIN:
      if (state.get('tabApplicationId') === action.applicationId) return state;
      return state
        .set('previousTabApplicationId', state.get('tabApplicationId'))
        .set('tabApplicationId', action.applicationId);

    default:
      return state;
  }
}
