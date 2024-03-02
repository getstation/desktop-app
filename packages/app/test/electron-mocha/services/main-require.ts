import { ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { firstConnectionHandler } from 'stream-electron-ipc';
import rpcchannel from 'stream-json-rpc';
import { ServicePeerHandler } from '../../../src/services/lib/class';
import { isPackaged } from '../../../src/utils/env';
import { TestServiceImpl } from './mock/main';

const dummyService = new TestServiceImpl('__test__');
const dummyService2 = new TestServiceImpl('__test2__');

const observable = new Observable(observer => {
  firstConnectionHandler(duplex => {
    const channel = rpcchannel(duplex, {
      forwardErrors: true, // !isPackaged,
    });
    observer.next(new ServicePeerHandler(channel, !isPackaged));
  }, 'bx-test');
});

observable.subscribe((client: ServicePeerHandler) => {
  client.connect(dummyService);
  client.connect(dummyService2);

  ipcMain.on('ask-is-connected-sync', (event: Electron.Event) => {
    event.returnValue = client.isConnected(dummyService);
  });
});

ipcMain.on('ask-destroy-sync', (event: Electron.Event) => {
  dummyService2.destroy();
  event.returnValue = true;
});
