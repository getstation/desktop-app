// tslint:disable
/**
 * Make `ipcRendererInternal` available as Electron uses it.
 * @see https://github.com/electron/electron/blob/81e9dab52f6f59a56c3f928156823dd482817539/lib/renderer/ipc-renderer-internal.ts
 * @see new version https://github.com/electron/electron/blob/fa3379a5d5cd6494c126be4d4d21a36c75f46554/lib/renderer/ipc-renderer-internal.ts
 */

import { EventEmitter } from 'events';

const { ipc } = (process as any)._linkedBinding('electron_renderer_ipc');
  
export const ipcRendererInternal = new EventEmitter() as any;
 
const internal = true;

ipcRendererInternal.send = function (channel: any, ...args: any[]) {
  return ipc.send(internal, channel, args);
};

ipcRendererInternal.sendSync = function (channel: any, ...args: any[]) {
  return ipc.sendSync(internal, channel, args)[0];
};

ipcRendererInternal.sendTo = function (webContentsId: any, channel: any, ...args: any[]) {
  return ipc.sendTo(internal, false, webContentsId, channel, args);
};

ipcRendererInternal.sendToAll = function (webContentsId: any, channel: any, ...args: any[]) {
  return ipc.sendTo(internal, true, webContentsId, channel, args);
};

ipcRendererInternal.invoke = async function (channel: string, ...args: any[]) {
  const { error, result } = await ipc.invoke(internal, channel, args);
  if (error) {
    throw new Error(`Error invoking remote method '${channel}': ${error}`);
  }
  return result;
};
