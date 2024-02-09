import * as fs from 'fs';
import * as path from 'path';

const getResourcePath = (rootPath: string) => path.resolve(__dirname, '../..', rootPath);

/**
 * Returns the full path of the PNG icon of the app
 */
export const getResourceIconPath = () => {
  const stableIconPath = getResourcePath('resources/icon.png');
  if (fs.existsSync(stableIconPath)) return stableIconPath;

  return undefined;
};
