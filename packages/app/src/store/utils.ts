import { Action } from 'redux';

export const isReduxAction = (action: any): action is Action<string> => (
  Boolean(action && typeof action.type === 'string')
);
