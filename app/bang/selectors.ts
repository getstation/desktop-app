import * as Immutable from 'immutable';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
import { createSelector } from 'reselect';

import { StationState } from '../types';

export const getSearchSessionId = (state: StationState): string =>
  state.getIn(['bang', 'searchSessionId'], undefined);

export const getSearchValue = (state: StationState): string =>
  state.getIn(['bang', 'searchValue'], '');

export const isVisible = (state: StationState): boolean =>
  state.getIn(['bang', 'isVisible'], false);

export const canShowInsert = (state: StationState): boolean =>
  state.getIn(['bang', 'showInsert'], true);

export const getResults = (state: StationState): Immutable.List<any> =>
  state.getIn(['bang', 'results'], Immutable.List());

export const getResultsJS = createSelector(
  getResults, results => results.toJS()
);
