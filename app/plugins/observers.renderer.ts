import bxsdk from '@getstation/sdk';
import * as Immutable from 'immutable';
import { Dispatch } from 'redux';
// @ts-ignore: no declaration file
import { observer } from 'redux-observers';
import bxSDK from '../sdk';
import { handleError } from '../services/api/helpers';
import { getServiceRuntimeRenderer } from './api';
import { getPlugins } from './selectors';

const pluginsToServiceIds = (plugins: Immutable.Map<string, any>) => {
  return plugins.map(p => p.get('serviceId')).values();
};

/**
 * @deprecated
 */
const getManifestURLFromServiceId = (plugins: Immutable.Map<string, any>, serviceId: string) => {
  return plugins.findKey(p => p.get('serviceId') === serviceId);
};

/**
 * Activate services on renderer side
 */
const observePluginsActivation = observer(
  getPlugins,
  (_dispatch: Dispatch<any>, plugins: Immutable.Map<string, any>, previousPlugins: Immutable.Map<string, any>) => {
    if (!plugins || plugins === previousPlugins) return;
    const pluginIds = Immutable.Set<string>(pluginsToServiceIds(plugins));
    const previousPluginIds = previousPlugins ? Immutable.Set<string>(pluginsToServiceIds(previousPlugins)) : Immutable.Set<string>();
    const newPluginIds = pluginIds.subtract(previousPluginIds).filter(Boolean);
    for (const serviceId of newPluginIds) {
      const manifestURL = getManifestURLFromServiceId(plugins, serviceId);
      getServiceRuntimeRenderer(serviceId)
        .then(runtime => {
          if (runtime) {
            const sdk = bxsdk(
              {
                id: manifestURL,
                name: manifestURL,
              },
              bxSDK
            );
            runtime.activate(sdk);
          }
        })
        .catch(handleError());
    }
  }
);

export default [
  observePluginsActivation,
];
