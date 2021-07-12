import * as Immutable from 'immutable';

export const getUserActivities = (state: Immutable.List<number>) : any =>
  state.get('userActivities');

export const isUserSAU = (state: Immutable.List<number>) : any => {
  return state.get('userActivities').size >= 3;
};
