import { RecursiveImmutableMap } from '../types';

export type StationOrderedFavorites = {
  applicationId: string,
  order: string[],
};

export type StationAllOrderedFavorites = Partial<Record<string, StationOrderedFavorites>>;
export type StationOrderedFavoritesImmutable = RecursiveImmutableMap<StationOrderedFavorites>;
export type StationAllOrderedFavoritesImmutable = RecursiveImmutableMap<StationAllOrderedFavorites>;
