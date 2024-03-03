/**
 * Helpers used by the bx renderer only
 */

import * as memoize from 'memoizee';
import ms = require('ms');
import { sortWith, descend } from 'ramda';
import { resolve as resolveUrl } from 'url';
// @ts-ignore no declaration file
import { fetchFavicon, setFetchFaviconTimeout } from '@getstation/fetch-favicon';

/**
 * Favicons helpers
*/
setFetchFaviconTimeout(5000);

export type SizedFavicon = { url: string, width: number, height: number };

const isValidAbsoluteUrl = (url: string) => {
  if (url[0] === '/') return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

async function safePromise<T>(p: Promise<T>): Promise<T | undefined> {
  try {
    return await p;
  } catch (e) {
    return undefined;
  }
}

// used to attempt to have the best quality favicon
export const getFavicon = memoize(async (originUrl: string): Promise<string | undefined> => {
  const favicon: string | undefined = await safePromise(fetchFavicon(originUrl));
  if (!favicon) return undefined;

  if (!isValidAbsoluteUrl(favicon)) { // here the favicon url could be relative: e.g. `/favicon.ico`
    return resolveUrl(originUrl, favicon);
  }

  return favicon;
}, { promise: true, maxAge: ms('1 day') });

// used to get base64 raw image dimensions
const getImageDimensions = memoize((url: string): Promise<SizedFavicon> => {
  return new Promise(resolve => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height, url });
    };

    img.onerror = () => {
      resolve({ width: 0, height: 0, url });
    };

    img.src = url;
  });
}, { promise: true, maxAge: ms('1 day') });

const sortByFaviconSize = sortWith([
  descend((favicon: { width: number, height: number, url: string }) => {
    return favicon.width * favicon.height;
  }),
]);

// used to get size on several favicons
export const getSizedAndOrderedFavicons = async (favicons: string[]): Promise<SizedFavicon[]> => {
  const sizedFavicons: SizedFavicon[] = [];
  for (const f of favicons) {
    try {
      const imageWithDimensions = await getImageDimensions(f);
      sizedFavicons.push(imageWithDimensions);
    } catch (e) {
      console.error('==========> error: ', e);
    }
  }
  return sortByFaviconSize(sizedFavicons);
};
