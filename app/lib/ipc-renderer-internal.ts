// tslint:disable
/**
 * Make `ipcRendererInternal` available as Electron uses it.
 * @see https://github.com/electron/electron/blob/81e9dab52f6f59a56c3f928156823dd482817539/lib/renderer/ipc-renderer-internal.ts
 */

const { ipc } = (process as any).electronBinding('ipc');
const v8Util = (process as any).electronBinding('v8_util');

// Created by init.js.
export const ipcRendererInternal = v8Util.getHiddenValue(global, 'ipc-internal');
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
