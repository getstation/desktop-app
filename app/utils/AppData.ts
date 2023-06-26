import * as fs from 'fs';
import * as path from 'path';
import * as electron from 'electron';
import * as log from 'electron-log';
import * as remote from '@electron/remote';

const app = (process.type === 'renderer') ? remote.app : electron.app;

export enum FILE {
  SHOW_RELEASE_NOTES = 'show_release_notes',
}

export const createLockFile = (file: FILE) => {
  // TODO : Change app.getPath() with ElectronAppService (or else) on migration
  const filepath = path.resolve(app.getPath('userData'), file);

  fs.writeFile(filepath, null, (err: any) => {
    if (err) {
      log.error(`[APP DATA] Error with creation of file ${file}`);
      throw err;
    }

    log.info(`[APP DATA] The file ${file} has been saved`);
    return true;
  });
};

export const consumeLockFileIfExists = (file: FILE) => {
  // TODO : Change app.getPath() with ElectronAppService (or else) on migration
  const filepath = path.resolve(app.getPath('userData'), file);

  return new Promise((resolve) => {
    fs.stat(filepath, (statErr) => {
      if (statErr) {
        resolve(false);
      }

      fs.unlink(filepath, (unlinkErr) => {
        if (unlinkErr) {
          log.error('[APP DATA]', unlinkErr);
          resolve(false);
        }

        log.info(`[APP DATA] file ${file} deleted successfully`);
        resolve(true);
      });
    });
  });
};
