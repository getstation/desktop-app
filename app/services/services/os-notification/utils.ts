import { nativeImage } from 'electron';
import fetch from 'electron-fetch';
import * as memoize from 'memoizee';

export const asNativeImage = memoize((url: string): Promise<Electron.NativeImage> => {
  return new Promise((resolve, reject) => {
    if (url.indexOf('data:') === 0) {
      resolve(nativeImage.createFromDataURL(url));
      return;
    }

    if (url.indexOf('http:') === 0 || url.indexOf('https:') === 0) {
      fetch(url)
        .then((res: any) => res.buffer())
        .then((buffer: Buffer) => {
          resolve(nativeImage.createFromBuffer(buffer));
        })
        .catch(reject);
      return;
    }

    try {
      resolve(nativeImage.createFromPath(url));
    } catch (e) {
      reject(new Error(`Unknow schema for ${url}`));
    }
  });
}, { promise: true, max: 20 });

export function getDoNotDisturb(): boolean {
  if (process.platform === 'win32') {
    const { getFocusAssist } = require('windows-focus-assist');
    const focusAssist: string = getFocusAssist().name;
    return focusAssist == 'PRIORITY_ONLY' || focusAssist == 'ALARMS_ONLY';
  }

  if (process.platform === 'darwin') {
    const { getDoNotDisturb: getMacOsDoNotDisturb } = require('macos-notification-state');
    return getMacOsDoNotDisturb();
  }

  return false;
}
