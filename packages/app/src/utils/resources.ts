import * as fs from 'fs';
import * as path from 'path';

export const getResourcePath = (rootPath: string) => path.resolve(__dirname, '../..', rootPath);

/**
 * Returns the full path of the PNG icon of the app
 */
export const getResourceIconPath = () => {
  const stableIconPath = getResourcePath('build/icon_512x512.png');
  if (fs.existsSync(stableIconPath)) return stableIconPath;

  return undefined;
};
