import { Observable } from 'rxjs/Rx';
import { firstConnectionHandler } from 'stream-electron-ipc';
import rpcchannel from 'stream-json-rpc';
import { isPackaged } from '../../utils/env';
import { servicesDuplexNamespace } from '../api/const';
import { ServicePeerHandler } from '../lib/class';

export const observeNewClients = () => {
  return new Observable(observer => {
    firstConnectionHandler(duplex => {
      const channel = rpcchannel(duplex, {
        forwardErrors: true, // !isPackaged,
      });
      observer.next(new ServicePeerHandler(channel, !isPackaged));
    }, servicesDuplexNamespace);
  });
};
