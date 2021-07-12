import { ServicePeer, ServicePeerHandler } from './class';
import { bxnotifier, endpoints, namespace } from './const';
import { service } from './decorator';
import { getFullUri, tryGetRequestMethod } from './helpers';
import { Endpoint, EndpointMap } from './types';

const getDefaultMethodInfos = (prop: string): Endpoint => {
  return {
    type: 'notification',
    getId: () => getFullUri(bxnotifier, prop),
  };
};

const getObjectHandler = <K extends ServicePeer>(md: EndpointMap, attributes?: string[]) => ({
  get: (obj: K, prop: string) => {
    if (prop in obj) {
      return Reflect.get(obj, prop);
    }
    if (!attributes || attributes.includes(prop)) {
      const methodInfos = md.get(prop);

      // if `methodInfos` is `undefined`, it means that we are dealing with a dynamically created Service.
      // For now, they are all assumed to be issuing only `notification` calls.

      if (!obj.peer) {
        // console.log('OBJ', obj)
      }

      return tryGetRequestMethod(obj.peer, methodInfos || getDefaultMethodInfos(prop), obj.peerHandler);
    }
    return undefined;
  },
  has: (obj: K, prop: string) => {
    if (attributes === undefined || prop in obj) {
      return Reflect.has(obj, prop);
    }
    return attributes.includes(prop);
  },
  ownKeys: (obj: K) => {
    const ownKeys = Reflect.ownKeys(obj);
    if (Array.isArray(attributes)) {
      return ownKeys.concat(attributes);
    }
    return ownKeys;
  },
  getOwnPropertyDescriptor: (obj: K, prop: string) => {
    if (Array.isArray(attributes) && attributes.includes(prop)) {
      return {
        configurable: true,
        enumerable: true,
        writable: false,
      };
    }
    return Reflect.getOwnPropertyDescriptor(obj, prop);
  },
});

const getConstructor = <K extends ServicePeer>(
  klass: { new(uuid?: string, srvcPeerHandler?: ServicePeerHandler): K },
  attributes?: string[]) => ({
    construct: (target: typeof klass, args: any[]) => {
      return new Proxy(
        new klass(args[0], args[1]),
        getObjectHandler(Reflect.getMetadata(endpoints, target.prototype) || new Map(), attributes)
      );
    },
  });

export const getNode = <T>(base: new(...args: any[]) => T, attributes?: string[]): (new(...args: any[]) => T) => {
  class ServiceNode extends ServicePeer {}

  const nmsp = (base as any)[namespace];
  service(nmsp, { endpointsOnly: false, register: false })(ServiceNode);

  return new Proxy(base as any, getConstructor(ServiceNode, attributes));
};
