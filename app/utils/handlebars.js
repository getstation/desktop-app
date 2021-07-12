import memoize from 'memoizee';

// handlebars tak some time to load: we lazy load it!
const getHandlebarsCompile = memoize(() => {
// eslint-disable-next-line global-require
  const Handlebars = require('handlebars');
  return memoize(Handlebars.compile);
});

export const format = (template, data) => getHandlebarsCompile()(template)(data);

/**
 * @deprecated
 */
export function formatInstanceLabel(service, configData) {
  const compile = getHandlebarsCompile();
  if (service.instanceLabel && configData) {
    const oConfigData = typeof configData.toJS === 'function' ? configData.toJS() : configData;
    if (oConfigData.userIdentity) {
      const { userIdentity } = oConfigData;
      if (userIdentity.email) {
        oConfigData.email = userIdentity.email;
      } else if (userIdentity.profileData && userIdentity.profileData.email) {
        oConfigData.email = userIdentity.profileData.email;
      }
    }
    return compile(service.instanceLabel)(oConfigData);
  }
  return service.name;
}
