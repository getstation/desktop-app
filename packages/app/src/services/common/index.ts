import { Observable } from 'rxjs';
import { firstConnectionHandler } from '../../utils/stream-ipc-proxy';
import rpcchannel from 'stream-json-rpc';
import { isPackaged } from '../../utils/env';
import { servicesDuplexNamespace } from '../api/const';
import { ServicePeerHandler } from '../lib/class';

import * as eos from 'end-of-stream';

export const observeNewClients = () => {
  return new Observable(observer => {
    firstConnectionHandler(duplex => {
      console.log('[DEBUG] observeNewClients: New client connected');
      const channel = rpcchannel(duplex, {
        forwardErrors: true, // !isPackaged,
      });
      const handler = new ServicePeerHandler(channel, !isPackaged);
      observer.next(handler);
      eos(duplex, () => {
        handler.destroy();
      });
    }, servicesDuplexNamespace);
  });
};
