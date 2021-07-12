import { webContents } from 'electron';

export type SendToAllWebcontentsFilter = (webContents: Electron.WebContents) => boolean;

declare interface SendToAllWebcontents {
  (channel: string, filter: SendToAllWebcontentsFilter, ...args: any[]): void;
  (channel: string, ...args: any[]): void;
}

/**
 * From main process, send a message to all webContents.
 * The optionnal `filter` allows to choose which webContents receives the message.
 * @param {string} channel
 * @param {function?} filter
 * @param args
 */
export const sendToAllWebcontents: SendToAllWebcontents = (channel: string, ...args: any[]) => {
  let filter: SendToAllWebcontentsFilter = () => true;
  if (typeof args[0] === 'function') {
    filter = args.shift();
  }
  webContents.getAllWebContents().forEach((wc) => {
    if (wc.isDestroyed() || wc.isCrashed()) return;
    if (!filter(wc)) return;
    wc.send(channel, ...args);
  });
};
