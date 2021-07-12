/* eslint-disable global-require */
const { parse } = require('url');

// If we are loading a custom page on the station: protocol,
// we inject some more properties on `window.bx` object
if (parse(window.location.href).protocol === 'station:') {
  const handlers = require('./handlers').default;

  const { hostname } = parse(window.location.href);
  const handler = handlers.find(h => h.hostname === hostname);

  if (handler && handler.hostname === 'multi-instance-configurator') {
    const services = require('../services/servicesManager').default;
    module.filename = handler.filePath;
    window.bx = {
      ...window.bx,
      manifest: services.manifest,
    };
  }
}
