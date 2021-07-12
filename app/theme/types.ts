import { RecursiveImmutableMap } from '../types';

export type StationTheme = {
  colors: [string, string, string, string],
  coords: {
    latitude: number,
    longitude: number,
  },
};

export type StationThemeImmutable = RecursiveImmutableMap<StationTheme>;
