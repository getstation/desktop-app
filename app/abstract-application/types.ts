import { ApplicationSettings } from '../application-settings/types';
import { ManifestData } from '../graphql/resolvers-types.generated';
import { Instance, Extension } from '../settings/applications/types';

export type AbstractApplication = {
  manifestURL: string,
  manifestCheckedAt: string,
  manifest: ManifestData,
  settings: ApplicationSettings,
  instances: Instance[],
  extensions: Extension[],
};
