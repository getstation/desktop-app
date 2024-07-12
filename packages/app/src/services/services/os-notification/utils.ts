import { nativeImage } from 'electron';
import * as memoize from 'memoizee';

export const asNativeImage = memoize((url: string): Promise<Electron.NativeImage> => {
  return new Promise((resolve, reject) => {
    if (url.startsWith('data:')) {
      resolve(nativeImage.createFromDataURL(url));
      return;
    }

    if (url.startsWith('http:') || url.startsWith('https:')) {
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => resolve(nativeImage.createFromBuffer(Buffer.from(arrayBuffer))))
        .catch(reject);
      return;
    }

    try {
      resolve(nativeImage.createFromPath(url));
    } 
    catch (e) {
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
//  vk: 2023.09.22 Looks like we don't have a library that works on modern OS (i.e 13.6) 
//      "macos-notification-state": "3.0.0" - uses modern API but it causes application crash on M1 CPU
//      "@stack-inc/macos-notification-state": "2.0.1" - fork of prevoius library. no crush, but it doesn't return correct value too.
    // const { getDoNotDisturb: getMacOsDoNotDisturb } = require('@stack-inc/macos-notification-state');
    // return getMacOsDoNotDisturb();
  }

  return false;
}
