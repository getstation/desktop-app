import { Middleware } from 'redux';

import { ActionsEmitter } from './types';
import { isReduxAction } from '../utils';

/*
 ** This middleware is needed to link the bus to actions
 ** just use `createActionsEmitter()` and pass the actionsEmitter to `createActionsBusMiddleware`
*/

export const createActionsBusMiddleware = (actionsEmitter: ActionsEmitter): Middleware => {
  return () => (next) => (action: any) => {
    if (isReduxAction(action)) {
      actionsEmitter.next(action);
    }
    return next(action);
  };
};
