import { ReactNode } from 'react';
import { Consumer } from '../common';

export namespace react {

  export interface ReactConsumer extends Consumer {
    createPortal(children: ReactNode, id: react.ValidPortalIds): void;
    setProviderInterface(providerInterface: react.ReactProviderInterface): void;
  }

  export interface ReactProviderInterface {
    createPortal(children: ReactNode, id: react.ValidPortalIds): void;
  }

  export type ValidPortalIds = 'portal-quickswitch';

}
