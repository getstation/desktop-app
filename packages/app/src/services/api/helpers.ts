import log from 'electron-log';
import { filter } from 'rxjs/operators'
import { mergeAll } from 'ramda';
import { logger } from '../../api/logger';
import { fromEvent } from 'rxjs';

export type HandleErrorOptions = {
  console: boolean, // default: true
  log: boolean, // default: true
};

const defaultOptions: HandleErrorOptions = { console: true, log: true };

export const handleError = (options: Partial<HandleErrorOptions> = defaultOptions) => {
  const { console: consoleOn, log: logOn } = mergeAll<Partial<HandleErrorOptions>>([defaultOptions, options]);
  return (e: Error, opts?: any) => {
    if (logOn && log) {
      log.error(e);
    }
    if (consoleOn && logger) {
      logger.notify(e, opts);
    }
  };
};

export const subscribeToEvent = (target: any, eventName: string, callback: any) => {
  return fromEvent(target, eventName, (_e: any, props: Electron.ContextMenuParams) => props)
    .subscribe(props => {
      callback(props);
    });
};

export const subscribeToIPCMessage = (target: any, eventName: string, callback: any) => {
  return fromEvent(target, 'ipc-message', (_e, channel, props) => ({ channel, props }))
    .pipe(filter(({ channel }) => channel === eventName))
    .subscribe(({ props }) => {
      callback(props);
    });
};
