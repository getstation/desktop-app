import * as Immutable from 'immutable';

export const SET_SUBDOCK_APPLICATION_ID = 'browserX/subdock/SET_SUBDOCK_APPLICATION_ID';
export type SET_SUBDOCK_APPLICATION_ID = 'browserX/subdock/SET_SUBDOCK_APPLICATION_ID';

// Action Types
export type setSubdockApplicationAction = { type: SET_SUBDOCK_APPLICATION_ID, applicationId: string };
export type SubdockActions =
  setSubdockApplicationAction;

// Action creators
export const setSubdockApplication = (applicationId: string): setSubdockApplicationAction => ({
  type: SET_SUBDOCK_APPLICATION_ID, applicationId,
});

// Reducer
export default function tabs(state: Immutable.Map<string, any> = Immutable.Map(), action: SubdockActions) {
  switch (action.type) {

    case SET_SUBDOCK_APPLICATION_ID: {
      return state
        .set('applicationId', action.applicationId);
    }

    default:
      return state;
  }
}
