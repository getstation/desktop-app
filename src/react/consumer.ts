import { ComponentClass } from 'react';
import { Consumer } from '../common';
import { react } from './index';

const protectedProvidersWeakMap = new WeakMap<react.ReactConsumer, react.ReactProviderInterface>();

export class ReactConsumer extends Consumer implements react.ReactConsumer {

  public readonly namespace = 'react';

  createPortal(children: ComponentClass, id: react.ValidPortalIds) {
    console.log('createPortal', protectedProvidersWeakMap, protectedProvidersWeakMap.get(this))
    protectedProvidersWeakMap.get(this)!.createPortal(children, id);
  }

  setProviderInterface(providerInterface: react.ReactProviderInterface) {
    console.log('set provider interface', providerInterface)
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
