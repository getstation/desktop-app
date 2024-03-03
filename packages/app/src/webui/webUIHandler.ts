import { net, protocol } from 'electron';
import { dirname } from 'path';
import { pathToFileURL } from 'url';
import { BX_PROTOCOL } from './const';
import handlers from './handlers';

protocol.registerSchemesAsPrivileged([
  { 
    scheme: BX_PROTOCOL, 
    privileges: { 
      standard: true, 
      secure: true,
    } 
  },
]);

export function start() {
  protocol.handle(BX_PROTOCOL, (req: GlobalRequest) => {
    const parsedUrl = new URL(req.url);
    const handler = handlers.find(h => h.hostname === parsedUrl.hostname);

    if (!handler) {
      return new Response(new Blob([`Handler not found for ${req.url}`]), { status: 404 });
    }
    if (!parsedUrl.pathname) {
      return new Response(new Blob([`Empty path in ${req.url}`]), { status: 404 });
    }

    if (parsedUrl.pathname !== '/') {
      const fileUrl = `${dirname(handler.filePath)}/${parsedUrl.pathname.substring(1)}`;
      return net.fetch(pathToFileURL(fileUrl).toString());
    }

    return net.fetch(pathToFileURL(handler.filePath).toString());
  });
}
