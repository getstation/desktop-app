import { ComponentClass } from 'react';

import { Consumer, DefaultWeakMap } from '../common';

import { react } from './index';

const protectedProvidersWeakMap = new DefaultWeakMap<react.ReactConsumer, react.ReactProviderInterface>();

export class ReactConsumer extends Consumer implements react.ReactConsumer {

  public readonly namespace = 'react';

  createPortal(children: ComponentClass, id: react.ValidPortalIds, position?: number) {
    protectedProvidersWeakMap.get(this)!.createPortal(children, id, position);
  }

  setProviderInterface(providerInterface: react.ReactProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
