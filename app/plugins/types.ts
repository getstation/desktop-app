import { RecursiveImmutableMap } from '../types';

export type StationServicesData = Record<string, Record<string, unknown>>;
export type ImmutableServicesData = RecursiveImmutableMap<Partial<StationServicesData>>;
