// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import { RPCChannelPeer } from 'stream-json-rpc';
import { ServiceBase, ServiceObserver as RealServiceObserver, ServicePeerHandler } from './class';
import { bxnotifier, namespace } from './const';
import { service } from './decorator';
import { serialize, unserialize } from './serialization';
import { Endpoint, RPC } from './types';

const d = require('debug')('service:utils:helpers');

export const tryGetRequestMethod = (peer: RPCChannelPeer | undefined, methodInfos: Endpoint, srvcPeerHandler?: ServicePeerHandler) => {
  if (!peer) {
    throw new Error('Service not connected');
  }
  try {
    return getRequestMethod(peer, methodInfos, srvcPeerHandler);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getRequestMethod = (peer: RPCChannelPeer, methodInfos: Endpoint, srvcPeerHandler?: ServicePeerHandler) => {
  const methodId = methodInfos.getId();
  d('calling remote', methodInfos.type, methodId);
  const uns = (param: [any]) => {
    return unserialize(srvcPeerHandler!, param)[0];
  };
  if (methodInfos.type === 'request') {
    return (...params: any[]) => peer.request(methodId, serialize(params, srvcPeerHandler) as any).then(uns);
  }
  return (...params: any[]) => peer.notify(methodId, serialize(params, srvcPeerHandler) as any);
};

export const getFullUri = (nmsp: string, methodName: string) => {
  return `${nmsp}:${methodName}`;
};

export const observer = <T>(object: T, prefix?: string): RPC.Node<T> & ServiceBase => {
  class ServiceObserver extends RealServiceObserver {}

  Object.assign(ServiceObserver.prototype, object);
  service(bxnotifier, { observer: true, register: false })(ServiceObserver);
  return new ServiceObserver(undefined, {
    uuidPrefix: prefix,
  }) as any;
};

export const serviceFullURI = (srvc: ServiceBase) => {
  return `${srvc.constructor[namespace]}:${srvc.uuid}`;
};
