import { app } from 'electron';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { isPackaged } from './env';

export default function readAppPackageJson(): typeof import('../../package.json') {
  let packageJsonPath: string;
  if (!isPackaged) {
    // used when directly transpiled via typescript
    const tsfilepath = resolve(__dirname, '..', '..', 'package.json');
    // used when transpiled via webpack
    const webpackfilepath = resolve(__dirname, '..', 'package.json');
    packageJsonPath = existsSync(webpackfilepath) ? webpackfilepath : tsfilepath;
  } else {
    packageJsonPath = resolve(app.getAppPath(), 'package.json');
  }

  return JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
}
