import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
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
  actionsEmitter.asObservable().pipe(skip(1)); // skip initial value
