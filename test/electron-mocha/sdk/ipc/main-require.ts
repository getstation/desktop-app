import bxsdk from '@getstation/sdk';
import { ipcMain } from 'electron';
import { from } from 'rxjs';
import { sendToAllWebcontents } from '../../../../app/lib/ipc-broadcast';
import bxSDK from '../../../../app/sdk/index';

(global as any).worker = Object.freeze({
  webContentsId: 1,
});

const sdk = bxsdk(
  {
    id: 'test',
    name: 'test',
  },
  bxSDK
);

// Renderer is the entry point for the test.
// This method allows the renderer to ask the main process to trigger a send request.
ipcMain.on('test:ipc:trigger-send-from-main', () => {
  sdk.ipc.publish({
    testKey: 'test value',
  });
});

// When the main process receives a new IPC message,
// forwards it to all renderers.
// @ts-ignore: limitation of Symbol.observable definition
from(sdk.ipc).subscribe((value) => {
  sendToAllWebcontents('test:ipc:trigger-send-from-renderer', value);
});
