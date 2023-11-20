import { join } from 'path';
import { isPackaged } from '../utils/env';
import { ProtocolHandler } from './types';

export default {
  hostname: 'appstore',
  filePath: join(isPackaged ? __dirname : __webpack_public_path__, 'appstore', 'index.html'),
} as ProtocolHandler;
