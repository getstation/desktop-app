import { GetApplicationForSubdockQuery } from './queries@local.gql.generated';

type Unpacked<T> = T extends (infer U)[] ? U : T;

export type Application = GetApplicationForSubdockQuery['application'];
export type Tab = Unpacked<Application['orderedTabsForSubdock']>;
export type Favorite = Unpacked<Application['orderedFavoritesForSubdock']>;
export type HomeTab = NonNullable<Application['tabApplicationHome']>;
