import * as log from 'electron-log';
import { Loggers } from './score';

const sillyLog = (prefix: string) => (...args: any[]) => log.silly(prefix, ...args);

const loggers: Loggers = {
  fuseLogger: sillyLog('[FUSE]'),
  contextualFrecencyLogger: sillyLog('[CONTEXTUAL-FRECENCY]'),
  globalFrecencyLogger: sillyLog('[GLOBAL-FRECENCY]'),
};

export default loggers;
