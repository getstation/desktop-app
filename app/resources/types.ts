import { resources } from '@getstation/sdk';

// ARIT: Application Resource Identifier Tuple
export type ARIT = [string, string]; // [manifestURL, appUrl]

export type ResourceMetaData = resources.ResourceMetaData;

export type OpenHandlers = Map<string, resources.OpenHandler>;
export type MetaDataHandlers = Map<string, resources.MetaDataHandler>;

export interface ResourceResolver {
  resolve(url: string): Promise<string | null>;
}

export interface ResourceRouter {
  open(url: string): Promise<void>;
  getMetadata(url: string): Promise<ResourceMetaData | null>;
  getResolver(): ResourceResolver;
}
