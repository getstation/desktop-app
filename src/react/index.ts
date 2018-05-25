import { ComponentClass } from 'react';
import { Consumer } from '../common';

export namespace react {

  export interface ReactConsumer extends Consumer {
    /**
     * Will render the given children in specified destination
     * @param {React.ComponentClass} children
     * @param {react.ValidPortalIds} id
     * @example
     * sdk.react.createPortal(MyReactComponent, 'portal-quickswitch');
     */
    createPortal(children: ComponentClass, id: react.ValidPortalIds): void;
    setProviderInterface(providerInterface: react.ReactProviderInterface): void;
  }

  export interface ReactProviderInterface {
    createPortal(children: ComponentClass, id: react.ValidPortalIds): void;
  }

  export type ValidPortalIds = 'portal-quickswitch';

}
