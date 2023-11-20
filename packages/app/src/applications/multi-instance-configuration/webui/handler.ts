import { join } from 'path';
import { isPackaged } from '../../../utils/env';
import { ProtocolHandler } from '../../../webui/types';

export default {
  hostname: 'multi-instance-configurator',
  filePath: join(isPackaged ? __dirname : __webpack_public_path__, 'multi-instance-configuration.html'),
} as ProtocolHandler;
