import { resources, SDK } from '@getstation/sdk';

import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import memoizee = require('memoizee');
import allSettled = require('promise.allsettled');
import { EMPTY, Observable } from 'rxjs';

import { idExtractor } from './activity';
import { ElectronGDriveOAuth2 } from './helpers';

const clientsStore = new Map<Credentials, ElectronGDriveOAuth2>();

const getMetadataHandler = memoizee(
  (clients: Map<Credentials, ElectronGDriveOAuth2>) =>
    async (url: string, defaultMetadata: resources.ResourceMetaData) => {
      const resourceId = idExtractor(url);

      if (resourceId) {
        const getFileFromClients = () => Array.from(clients.values())
          .map(c => c.getFile(resourceId));

        const responses = await allSettled(getFileFromClients());
        const fulfilledResponse = responses.find(res => res.status === 'fulfilled');

        if (fulfilledResponse) {
          // @ts-ignore : value property exists
          const file = fulfilledResponse.value;

          const { bxResourceId, manifestURL, themeColor } = defaultMetadata;

          return {
            bxResourceId,
            manifestURL,
            image: file.iconLink,
            title: file.name,
            description: file.email,
            themeColor: themeColor,
            url: file.webViewLink,
          };
        }

        return defaultMetadata;
      }

      return defaultMetadata;
    },
  { maxAge: 15000 }
);

export const setResourcesHandlers = (
  sdk: SDK,
  clientsWithEmails: Map<Credentials, ElectronGDriveOAuth2>
): Observable<Error> => {
  sdk.resources.setMetaDataHandler(getMetadataHandler(clientsWithEmails));
  return EMPTY;
};

export const addResourcesHandler = (
  sdk: SDK,
  token: Credentials,
  client: ElectronGDriveOAuth2
): Observable<Error> => {
  clientsStore.set(token, client);
  setResourcesHandlers(sdk, clientsStore);
  return EMPTY;
};

export const removeResourcesHandler = (
  sdk: SDK,
  token: Credentials
): Observable<Error> => {
  clientsStore.delete(token);
  setResourcesHandlers(sdk, clientsStore);
  return EMPTY;
};
