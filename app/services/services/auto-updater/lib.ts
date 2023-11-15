import { isPackaged } from '../../../utils/env';
import AutoUpdaterMock from './AutoUpdaterMock';
import { autoUpdater as autoUpdaterProd } from 'electron-updater';

if (isPackaged) {
    autoUpdaterProd.allowPrerelease = false;
}

export const autoUpdater = isPackaged ? autoUpdaterProd : new AutoUpdaterMock();
