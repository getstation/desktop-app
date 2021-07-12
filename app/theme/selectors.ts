import { createSelector } from 'reselect';
import { ImmutableList, StationState } from '../types';

export const getThemeColors = createSelector(
  (state: StationState): ImmutableList<[string, string, string, string]> => state.getIn(['theme', 'colors'] as any),
  colors => colors.toArray()
);
