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
