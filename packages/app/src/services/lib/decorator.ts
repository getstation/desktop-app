import { endpoints, metadata, namespace } from './const';
import { allServicesRegistry } from './registry';
import { Endpoint, EndpointOptions, ServiceDecoratorOptions } from './types';

const d = require('debug')('service:utils:decorator');

export const setMetadata = (m: symbol | string, key: string, value: any, aclass: any) => {
  let md: Map<string, any> | undefined = Reflect.getOwnMetadata(m, aclass);
  if (!md) {
    md = new Map();
    Reflect.defineMetadata(m, md, aclass);
  }
  md.set(key, value);
};

export const getMetadata = (m: symbol | string, key: string, aclass: any) => {
  const md: Map<string, any> | undefined = Reflect.getOwnMetadata(m, aclass);
  if (!md) return undefined;
  return md.get(key);
};

export const bindServiceEndpoints = (aclass: any, options: ServiceDecoratorOptions) => {
  for (const key of Object.getOwnPropertyNames(aclass.prototype)) {
    if (key === 'constructor') continue;
    const attribute: unknown = aclass.prototype[key];
    if (typeof attribute !== 'function') continue;
    const endpointOptions: EndpointOptions = {
      type: options.observer ? 'notification' : 'request',
    };
    endpoint(endpointOptions)(aclass.prototype, key);
  }
};

/**
 * Set the namespace for the Service.
 * ⚠ This is called after methods decorators.
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-evaluation
 */
export const service = (n: string, options: ServiceDecoratorOptions = {}) => {
  const defaultOptions = {
    register: true,
    endpointsOnly: true,
    observer: false,
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  return (aclass: any) => {
    d('new service', n, aclass.name);
    aclass[namespace] = n;
    if (mergedOptions.register) {
      allServicesRegistry.add(aclass, `${n}:${aclass.name}`);
    }

    if (mergedOptions.endpointsOnly) {
      bindServiceEndpoints(aclass, mergedOptions);
    }
  };
};

export const endpoint = (options: EndpointOptions = {}) => {
  return (aclass: any, methodName: string) => {
    if (aclass.constructor[namespace] === undefined) {
      throw new Error(`Namespace of ${aclass.constructor.name} must not be undefined`);
    }
    const fullUriGetter = () => `${aclass.constructor[namespace]}:${options.methodIdentifier || methodName}`;
    // Retieve additional metadata
    const existingMd = getMetadata(metadata, methodName, aclass);
    const infos: Endpoint = {
      getId: fullUriGetter,
      type: options.type || 'request',
      ...existingMd,
    };
    d('new endpoint', aclass.constructor.name, methodName);
    setMetadata(endpoints, methodName, infos, aclass);
  };
};

export const timeout = (ms: number) => {
  return (aclass: any, methodName: string) => {
    d('new timeout', aclass.constructor.name, methodName);
    setMetadata(metadata, methodName, {
      timeout: ms,
    }, aclass);
  };
};
