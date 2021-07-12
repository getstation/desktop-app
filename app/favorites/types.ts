import { RecursiveImmutableMap } from '../types';

export type StationFavorite = {
  favoriteId: string,
  favicons: string[],
  title: string,
  url: string,
  applicationId: string,
};
export type StationFavorites = {
  favorites: Partial<Record<string, StationFavorite>>,
};
export type StationFavoriteImmutable = RecursiveImmutableMap<StationFavorite>;
export type StationFavoritesImmutable = RecursiveImmutableMap<StationFavorites>;
