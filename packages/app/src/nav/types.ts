import { ImmutableMap } from '../types';

export type StationNav = {
  previousTabApplicationId?: string,
  tabApplicationId?: string,
};

export type StationNavImmutable = ImmutableMap<StationNav>;
