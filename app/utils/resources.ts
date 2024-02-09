import * as fs from 'fs';
import * as path from 'path';

import { isLinux } from './process';

/**
 * Returns the full path of the PNG icon of the app
 */
export const getResourceIconPath = () => {
  if (isLinux) {
    const stableIconPath = path.resolve(__dirname, '../../resources/icon.png');
    if (fs.existsSync(stableIconPath)) {
      return stableIconPath;
    }
  }
  return undefined;
};
