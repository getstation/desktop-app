import { Consumer } from '../common';

export namespace resources {
  export type OpenHandler = (url: string, defaultOpen: () => Promise<void>) => Promise<void>;
  export type MetaDataHandler = (url: string, defaultMetadata: ResourceMetaData) => Promise<resources.ResourceMetaData>;

  export interface ResourcesConsumer extends Consumer {
    setOpenHandler: (handler: OpenHandler) => void;
    setMetaDataHandler: (handler: MetaDataHandler) => void;
    setProviderInterface(providerInterface: resources.ResourcesProviderInterface): void
  }

  export interface ResourcesProviderInterface {
    setOpenHandler: (manifestURL: string, handler: OpenHandler) => void;
    setMetaDataHandler: (manifestURL: string, handler: MetaDataHandler) => void;
  }

  // http://ogp.me/#metadata
  export interface ResourceMetaData {
    bxResourceId: string,
    manifestURL: string,
    image: string,
    title: string,
    description?: string,
    themeColor?: string,
    url?: string,
  }
}
