import * as path from 'path';
import { format as formatUrl } from 'url';
import { isPackaged } from './env';

const host = process.env.ELECTRON_WEBPACK_WDS_HOST || 'localhost';
const port = process.env.ELECTRON_WEBPACK_WDS_PORT || 9080;

export const getUrlToLoad = (filename: string) => {
  if (isPackaged) {
    return formatUrl({
      pathname: path.join(__dirname, filename),
      protocol: 'file',
      slashes: true,
    });
  }

  return `http://${host}:${port}/${filename}`;
};
