import { ServiceBase, ServicePeerHandler } from './class';
import { namespace } from './const';
import { getNode } from './getNode';
import { allServicesRegistry } from './registry';
import { IServiceBase, NamespacedConstructor, SerializedService } from './types';

const d = require('debug')('service:utils:serialization');

const isService = (params: any): params is ServiceBase => {
  return params instanceof ServiceBase;
};

const getPrototypePropertyNames = (params: any): string[] => {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(params)).filter(x => x !== 'constructor');
};

const getClosestSerializableConstructor = <T extends IServiceBase>(service: T): NamespacedConstructor => {
  let p = Object.getPrototypeOf(service);
  while (p) {
    const isNamespaceAttached = Object.getOwnPropertySymbols(p.constructor).includes(namespace);
    if (isNamespaceAttached) {
      return p.constructor;
    }
    p = Object.getPrototypeOf(p);
  }
  throw new Error('Parameter is not a Service');
};

const serializeService = <T extends IServiceBase>(params: T): SerializedService => {
  const targetConstructor = getClosestSerializableConstructor(params);
  const ret = {
    $$uuid: params.uuid,
    $$namespace: targetConstructor[namespace],
    $$constructor: targetConstructor.name,
    $$attributes: getPrototypePropertyNames(params),
  } as SerializedService;
  d('serializeService', ret);
  return ret;
};

const isSerializedService = (param: any): param is SerializedService => {
  return param && param.$$constructor && param.$$namespace && param.$$uuid;
};

const unserializeService = (srvcPeerHandler: ServicePeerHandler, params: SerializedService) => {
  const klass = tryGetRegisteredClass(params);

  d('unserializeService');
  const node = new (getNode(klass, params.$$attributes))(params.$$uuid);
  srvcPeerHandler.connect(node, klass);

  return node;
};

const tryGetRegisteredClass = (params: SerializedService) => {
  const uri = `${params.$$namespace}:${params.$$constructor}`;
  if (!allServicesRegistry.has(uri)) {
    throw new Error(`Unknown class for URI ${uri}`);
  }
  return allServicesRegistry.get(uri)!;
};

const stringifyResolver = (srvcPeerHandler?: ServicePeerHandler) => (_key: string, value: any) => {
  if (isService(value)) {
    if (srvcPeerHandler && !srvcPeerHandler.isConnected(value)) {
      d('serialize: Dynamic connection');
      srvcPeerHandler.connect(value);
    }
    return serializeService(value);
  }
  if (value instanceof Date) {
    return `$$date:${value.toISOString()}`;
  }
  return value;
};

export const serialize = (params: any[] = [], srvcPeerHandler?: ServicePeerHandler): string[] => {
  d('serialize');
  if (!Array.isArray(params)) throw new Error('params must be an array');
  // see https://stackoverflow.com/questions/21034760/strange-behaviour-in-json-stringify-with-replacer-function
  const storeToJSON = Date.prototype.toJSON;
  delete Date.prototype.toJSON;
  const res = params.map(param => JSON.stringify(param, stringifyResolver(srvcPeerHandler)));
  Date.prototype.toJSON = storeToJSON;
  return res;
};

const parseReviver = (srvcPeerHandler: ServicePeerHandler) => (_key: string, value: any) => {
  if (isSerializedService(value)) {
    return unserializeService(srvcPeerHandler, value);
  }
  if (typeof value === 'string' && value.startsWith('$$date:')) {
    return new Date(value.slice('$$date:'.length));
  }
  return value;
};

export const unserialize = (srvcPeerHandler: ServicePeerHandler, params: any[]): any[] => {
  d('unserialize', params);
  return params.map(param => {
    if (param === undefined || param === 'undefined') return undefined;
    return JSON.parse(param, parseReviver(srvcPeerHandler));
  });
};
