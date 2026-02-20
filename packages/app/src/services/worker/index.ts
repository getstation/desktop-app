import { ElectronIpcRendererDuplex } from '../../utils/stream-ipc-proxy';
import rpcchannel, { RPCChannel } from 'stream-json-rpc';
import { isPackaged } from '../../utils/env';
import { servicesDuplexWorkerMainNamespace } from '../api/const';
import { ServicePeerHandler } from '../lib/class';
import { mainServices as mainServicesRenderer } from '../renderer';
import { ApolloLinkServiceImpl } from '../services/apollo-link/worker';
import { ManifestServiceImpl } from '../services/manifest/main';
import { SDKv2ServiceImpl } from '../services/sdkv2/worker';
import { GlobalServices, ServicesInitializerImpl } from '../types';

export const getMainPeerHandler = () => {
  const duplex = new ElectronIpcRendererDuplex(0, servicesDuplexWorkerMainNamespace);
  const channel: RPCChannel = rpcchannel(duplex, {
    forwardErrors: true, // !isPackaged,
  });
  return new ServicePeerHandler(channel, !isPackaged);
};

const initWorker = (service: any, uuid: string) => () => {
  return new service(uuid);
};

export const mainServices = mainServicesRenderer;

export const workerServices: ServicesInitializerImpl<GlobalServices> = {
  apolloLink: initWorker(ApolloLinkServiceImpl, '__default__'),
  sdkv2: initWorker(SDKv2ServiceImpl, '__default__'),
  manifest: initWorker(ManifestServiceImpl, '__default__'),
};
