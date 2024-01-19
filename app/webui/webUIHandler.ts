import { protocol } from 'electron';
import { dirname } from 'path';
import { parse } from 'url';
import { BX_PROTOCOL } from './const';
import handlers from './handlers';

protocol.registerSchemesAsPrivileged([
  { scheme: BX_PROTOCOL, privileges: { standard: true, secure: true } },
]);

export function start() {
  protocol.registerFileProtocol(BX_PROTOCOL, (req, callback) => {
    const parsedUrl = parse(req.url);
    const handler = handlers.find(h => h.hostname === parsedUrl.hostname);

    if (!handler) {
      // @ts-ignore
      return callback(-6); // file not found
    }

    if (!parsedUrl.pathname) {
      // @ts-ignore
      return callback(-6); // file not found
    }

    if (parsedUrl.pathname !== '/') {
      return callback(`${dirname(handler.filePath)}/${parsedUrl.pathname.substr(1)}`);
    }

    return callback(handler.filePath);
  });
}
