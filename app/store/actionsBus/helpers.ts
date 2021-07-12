import { BehaviorSubject } from 'rxjs/Rx';
import { ActionsEmitter, ActionsBus } from './types';

/*
 * Needed by `createActionsBus` and `createActionsBusMiddleware`
*/
export const createActionsEmitter = (): ActionsEmitter => new BehaviorSubject({ type: '' }); // initial value is mandatory for behavior subject

/*
* An `actionsBus` is just an observable of redux actions
* it can be provided via props or context api
*/
export const createActionsBus = (actionsEmitter: ActionsEmitter): ActionsBus =>
  actionsEmitter.asObservable().skip(1); // skip initial value
