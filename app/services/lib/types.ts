import { namespace } from './const';

export interface IServiceBase {
  uuid: string;
}

export type Endpoint = {
  type: 'request' | 'notification',
  timeout?: number, // 0 means no timeout
  getId: () => string,
};

export type EndpointMap = Map<string, Endpoint>;

export type EndpointOptions = {
  methodIdentifier?: string,
  type?: 'request' | 'notification',
};
export type NamespacedConstructor = {
  name: string,
  [namespace]: string,
};
export type SerializedService = {
  $$uuid: string,
  $$namespace: string,
  $$constructor: string,
  $$attributes: string[],
};
export type ServiceDecoratorOptions = { endpointsOnly?: boolean, observer?: boolean, register?: boolean };
export type SubscriptionConstructorParam = {
  unsubscribe: () => void,
} | (() => void);

export type ServiceBaseConstructorOptions = {
  ready?: boolean,
  uuidPrefix?: string,
};

type ExcludeServiceBaseProps<T> = Exclude<T, 'uuid' | 'whenReady' | 'ready$' | 'emitter' | 'destroy' | 'destroyedEmitted'>;
export namespace RPC {
  export type RequestMethod<T extends any[], R> =
    (...params: T) => Promise<R>;

  export type NotificationMethod<T extends any[]> =
    (...params: T) => void;

  export type Interface<T> = {
    [key in ExcludeServiceBaseProps<keyof T>]:
      T[key] extends RequestMethod<any[], any> ? T[key] :
        T[key] extends NotificationMethod<any[]> ? T[key] :
          never;
  };

  export type Node<T> = IServiceBase & Interface<T>;

  export type ObserverNode<T> = IServiceBase & Readonly<Partial<Interface<T>>>;

  export interface Subscription {
    unsubscribe: () => void,
  }
}
