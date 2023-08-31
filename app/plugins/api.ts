import { SDK } from '@getstation/sdk';
import { evolve } from 'ramda';
import { Observable } from 'rxjs';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import { service } from '../services/lib/decorator';

import { Transformer } from '../utils/fp';
import { SDKConsumer } from './SDKProvider';

type SDKActivator = (sdk: SDK, bx?: SDKConsumer) => Promise<void> | Observable<Error> | Promise<Observable<Error>> | any;
type SDKDeactivator = (sdk: SDK, bx?: SDKConsumer) => void;

type Activator = (sdk: SDK, bx?: SDKConsumer) => Promise<Observable<Error>>;
type Deactivator = SDKDeactivator;

/**
 * Describe the shape of a service runtime (sdk side).
 * @deprecated
 */
interface SDKServiceRuntime {
  activate: SDKActivator,
  deactivate: SDKDeactivator,
}
/**
 * Describe the shape of a service runtime (bx side).
 * @deprecated
 */
export interface ServiceRuntime {
  activate: Activator,
  deactivate: Deactivator,
}

const ensureActivator: Transformer<SDKActivator, Activator> = activate => async (sdk: SDK, bx?: SDKConsumer) => {
  const result = await activate(sdk, bx);
  return result instanceof Observable ? result : Observable.empty();
};

const ensureRuntime: Transformer<SDKServiceRuntime, ServiceRuntime> = evolve({
  activate: ensureActivator,
});

/**
 * Load the `ServiceRuntime` of a given service.
 * If there is no runtime defined (no `main` key in service definition), load
 * a dummy runtime that does nothing.
 */
export const getServiceRuntime = async (manifest: BxAppManifest): Promise<ServiceRuntime | void> => {
  if (!manifest || !manifest.main) return;

  const sdkRuntime: ServiceRuntime = await import(
    `../../manifests/runtime/${manifest.main}`)
    .then(({ default: main }) => main);

  return ensureRuntime(sdkRuntime);
};

/**
 * Load the `ServiceRuntimeRenderer` of a given service.
 * If there is no runtime defined (no `renderer` key in service definition), load
 * a dummy runtime that does nothing.
 * FIXME migrate this to use manifest
 */
export const getServiceRuntimeRenderer = async (serviceId?: string): Promise<ServiceRuntime | void> => {
  return;
  /*if (!manifest || !manifest.main) return;

  const sdkRuntime: ServiceRuntime = await import(
    `../../manifests/runtime/${manifest.renderer}`)
    .then(({ default: main }) => main);

  return ensureRuntime(sdkRuntime);*/
};
