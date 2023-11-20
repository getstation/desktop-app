import { List } from 'immutable';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Actions
export const ADD_ACTIVITY = 'browserX/user/ADD_ACTIVITY';
export type ADD_ACTIVITY = 'browserX/user/ADD_ACTIVITY';
export const CLEAR_ACTIVITY_STATE = 'browserX/user/CLEAR_ACTIVITY_STATE';
export type CLEAR_ACTIVITY_STATE = 'browserX/user/CLEAR_ACTIVITY_STATE';

// Action Types
export type addActivityAction = { type: ADD_ACTIVITY, timestamp: number };
export type clearActivityStateAction = { type: CLEAR_ACTIVITY_STATE };
export type UserActivitiesActions =
  addActivityAction |
  clearActivityStateAction;

// Action creators
export const addActivity = (timestamp: number) => ({
  type: ADD_ACTIVITY, timestamp,
});
export const clearActivityState = () => ({
  type: CLEAR_ACTIVITY_STATE,
});

const DEFAULT_STATE = List();

// Reducer
export default function reducer(state: typeof DEFAULT_STATE = DEFAULT_STATE, action: UserActivitiesActions) {
  switch (action.type) {
    case ADD_ACTIVITY: {
      return state.push(action.timestamp);
    }
    case CLEAR_ACTIVITY_STATE: {
      return state.clear();
    }
    default:
      return state;
  }
}
