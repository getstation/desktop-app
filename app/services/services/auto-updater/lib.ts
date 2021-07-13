import { isPackaged } from '../../../utils/env';
import AutoUpdaterMock from './AutoUpdaterMock';
import { autoUpdater as autoUpdaterProd } from 'electron-updater';

export const autoUpdater = !isPackaged ? new AutoUpdaterMock() : autoUpdaterProd;
