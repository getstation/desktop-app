import * as eos from 'end-of-stream';
import { EventEmitter } from 'events';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { RPCChannel, RPCChannelPeer } from 'stream-json-rpc';
import { bxnotifier, bxsubscription, endpoints } from './const';
import { Debugger } from './debug';
import { service } from './decorator';
import { getRequestMethod, serviceFullURI } from './helpers';
import { serialize, unserialize } from './serialization';
import { Endpoint, EndpointMap, IServiceBase, RPC, ServiceBaseConstructorOptions, SubscriptionConstructorParam } from './types';

const uuidv4 = require('uuid/v4');
const d = require('debug')('service:utils:class');

const getRequestsMetadata = (constructor: Function | undefined): EndpointMap => {
  if (constructor) {
    d('target interface', constructor.name);
    return Reflect.getMetadata(endpoints, constructor.prototype) || new Map();
  }
  return new Map();
};

const maybeSetServicePeer = (sph: ServicePeerHandler, srvc: ServiceBase, peer: RPCChannelPeer) => {
  if (srvc instanceof ServicePeer) {
    srvc.peer = peer;
    srvc.peerHandler = sph;

    // Destroy service if peer is destroyed.
    // ⚠️ Only valid for `ServicePeer` because of the 1-1 link between a peer and its Service.
    // A `ServiceBase` can have multiple peers (like all global __default__ services for instance),
    // and thus we can't assume that closing a peer will also destroy the Service.
    eos(peer, () => {
      srvc.destroy();
    });
  }
  // Destroy peer if service emits `destroyed` event
  srvc.emitter.once('destroyed', () => {
    if (!peer.closed) {
      peer.destroy();
    }
  });
};

export class ServicePeerHandler {
  public channel: RPCChannel;
  public debug: Debugger | undefined;
  public connectedServices: Map<string, RPCChannelPeer>;

  constructor(channel: RPCChannel, debug?: boolean) {
    this.channel = channel;
    this.connectedServices = new Map();
    if (debug) {
      this.debug = new Debugger(this);
    }
  }

  public connect(srvc: ServiceBase, constructor?: Function): RPCChannelPeer {
    const fulluri = serviceFullURI(srvc);
    let peer: RPCChannelPeer;
    if (this.isConnected(fulluri)) {
      peer = this.connectedServices.get(fulluri)!;
      d('attaching existing connection to', fulluri);
      maybeSetServicePeer(this, srvc, peer);
      return peer;
    }

    d('connecting', fulluri);

    peer = this.channel.peer(fulluri);
    peer.setMaxListeners(20);
    this.connectedServices.set(fulluri, peer);

    this.bindAllRemoteMethodHandlers(srvc, peer);
    this.bindAllRequests(srvc, peer, constructor);
    maybeSetServicePeer(this, srvc, peer);

    if (this.debug) {
      this.debug.check();
    }

    eos(peer, () => {
      d('peer ended', fulluri);
      this.connectedServices.delete(fulluri);
      if (this.debug) {
        this.debug.check();
      }
    });

    return peer;
  }

  public isConnected(serviceOrURI: string | ServiceBase) {
    if (typeof serviceOrURI === 'string') {
      return this.connectedServices.has(serviceOrURI);
    }
    return this.connectedServices.has(serviceFullURI(serviceOrURI));
  }

  protected bindAllRemoteMethodHandlers(srvc: ServiceBase, peer: RPCChannelPeer) {
    const endpointsMetadata: EndpointMap = Reflect.getMetadata(endpoints, srvc) || new Map();

    // Some weird behavior here, we're unable to loop onto md
    // without putting it through `Array.from`...
    // Probably comes from electron-compile
    for (const [methodName, methodInfos] of Array.from(endpointsMetadata.entries())) {
      this.remoteMethodHandler(peer, srvc, methodName, methodInfos);
    }
  }

  protected bindAllRequests(srvc: ServiceBase, peer: RPCChannelPeer, constructor: Function | undefined) {
    const requestsMetadata = getRequestsMetadata(constructor);

    for (const [methodName, methodInfos] of Array.from(requestsMetadata.entries())) {
      this.bindRequests(peer, srvc, methodName, methodInfos);
    }
  }

  protected remoteMethodHandler(peer: RPCChannelPeer, srvc: ServiceBase, methodName: string, methodInfos: Endpoint) {
    const methodIdentifier = methodInfos.getId();
    d('defining a new handler', methodInfos.type, methodIdentifier);
    const se = (...params: any[]) => {
      return serialize(params, this);
    };
    if (methodInfos.type === 'request') {
      peer.setRequestHandler(methodIdentifier, (params: any[]) => {
        d('request handler called', methodName);
        try {
          const fn = Reflect.apply(Reflect.get(srvc, methodName), srvc, unserialize(this, params));
          return fn.then(se);
        } catch (e) {
          console.error(e);
          throw e;
        }
      }, methodInfos.timeout);
    } else {
      peer.setNotificationHandler(methodIdentifier, (params: any[]) => {
        d('notification handler called', methodName);
        try {
          Reflect.apply(Reflect.get(srvc, methodName), srvc, unserialize(this, params));
        } catch (e) {
          console.error(e);
          throw e;
        }
      });
    }
  }

  protected bindRequests(peer: RPCChannelPeer, srvc: ServiceBase, methodName: string, methodInfos: Endpoint) {
    const requestMethod = getRequestMethod(peer, methodInfos, this);
    d('defining a new request', methodInfos.type, methodInfos.getId());
    Object.defineProperty(srvc, methodName, {
      value: function (this: ServiceBase, ...params: any[]) {
        try {
          return requestMethod(...params);
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      configurable: false,
    });
  }
}

export abstract class ServiceBase implements IServiceBase {
  public uuid: string;
  public emitter: EventEmitter;
  private readonly ready$: BehaviorSubject<boolean>;
  private destroyedEmitted: boolean;

  constructor(uuid?: string, options?: ServiceBaseConstructorOptions) {
    const prefix = (options && options.uuidPrefix) ? `${options.uuidPrefix}:` : '';
    this.uuid = `${prefix}${uuid || uuidv4()}`;
    this.ready$ = new BehaviorSubject(false);
    this.emitter = new EventEmitter();
    this.destroyedEmitted = false;

    const isAlreadyReady = !options || options.ready === undefined || options.ready;
    if (isAlreadyReady) {
      this.ready();
    }
  }

  // Can only be called by implementation
  public destroy() {
    if (this.destroyedEmitted) return;
    this.emitter.emit('destroyed');
    this.destroyedEmitted = true;
  }

  protected whenReady() {
    return this.ready$
      .pipe(filter(x => Boolean(x)))
      .pipe(take(1))
      .toPromise();
  }

  protected ready() {
    this.ready$.next(true);
    this.ready$.complete();
  }
}

export abstract class ServicePeer extends ServiceBase {
  peer: RPCChannelPeer | undefined;
  peerHandler: ServicePeerHandler | undefined;

  constructor(uuid?: string, srvcPeerHandler?: ServicePeerHandler) {
    super(uuid);
    if (srvcPeerHandler) {
      srvcPeerHandler.connect(this);
    }
  }
}

@service(bxnotifier, { observer: true })
export class ServiceObserver extends ServiceBase {
}

const unsubscribeOne = (sub: SubscriptionConstructorParam) => {
  if (typeof sub === 'function') {
    return sub();
  }
  sub.unsubscribe();
};

@service(bxsubscription, { observer: true })
export class ServiceSubscription extends ServiceBase implements RPC.Subscription {
  public static noop = new ServiceSubscription(() => {});

  protected sub: SubscriptionConstructorParam | SubscriptionConstructorParam[];

  constructor(sub: SubscriptionConstructorParam | SubscriptionConstructorParam[], disposable?: RPC.Node<any>, source?: ServiceBase) {
    super();
    this.sub = sub;
    if (source) {
      source.emitter.once('destroyed', () => {
        this.unsubscribe();
      });
    }
    if (disposable) {
      this.emitter.once('destroyed', () => {
        if (disposable.peer && !disposable.peer.closed) {
          disposable.peer.destroy();
        }
      });
    }
  }

  unsubscribe() {
    if (Array.isArray(this.sub)) {
      this.sub.forEach(unsubscribeOne);
    } else {
      unsubscribeOne(this.sub);
    }
    this.destroy();
  }
}
