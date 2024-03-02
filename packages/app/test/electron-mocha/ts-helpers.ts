import * as Immutable from 'immutable';
import { Action } from 'redux';
import { expectSaga, RunResult, SagaType } from 'redux-saga-test-plan';
import { PutEffect } from 'redux-saga/effects';
import rootReducer from '../../app/reducers';
import { StationState } from '../../app/types';

// Complete me when necessary
export const initialState = Immutable.Map({
  subwindows: new Set(),
});

/**
 * Returns an Immutable state that can be used by expectSaga
 * @param object
 * @return {Immutable.Map<string, Set<any>>}
 */
export const generateInitialState = (object: any) => {
  return initialState.merge(Immutable.fromJS(object));
};

/**
 * Leverages `expectSaga` and feed it our reducers
 * @param {SagaType} saga
 * @param {StationState} state
 * @param {any[]} sagaArgs
 * @return {ExpectApi}
 */
export const expectSagaWithState = (saga: SagaType, state: StationState, ...sagaArgs: any[]) => {
  return expectSaga(saga, ...sagaArgs).withReducer(rootReducer, state);
};

/**
 * For a given PUT effect, retrieve its action
 * @param {PutEffect<A extends Action>} effect
 * @return {A}
 */
export const getPutAction = <A extends Action>(effect: PutEffect<A>) => {
  return effect.PUT.action;
};

export const findPutEffects = (effects: RunResult['effects'], actionType: string) => {
  return (effects.put || []).filter(p => getPutAction(p).type === actionType);
};
