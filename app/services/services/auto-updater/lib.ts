import { autoUpdater as autoUpdaterProd } from 'electron-updater';

import { isPackaged } from '../../../utils/env';
import { isWindows7 } from '../../../utils/process';
import AutoUpdaterMock from './AutoUpdaterMock';

if (isPackaged) {
    autoUpdaterProd.allowPrerelease = false;
}

export const autoUpdater = isPackaged && !isWindows7() // Disable auto update for Windows
                ? autoUpdaterProd : new AutoUpdaterMock();
