import { resources, SDK } from '@getstation/sdk';

import { EMPTY, Observable } from 'rxjs';

import { idExtractor } from './activity';
import { getResource } from './gateway/api';
import { fetchPage, fetchPublicPageFromBlockId } from './gateway/methods';
import { pageInfos, publicPageToWorkspace } from './gateway/transformer';

const getOpenHandler = (sdk: SDK) => async (url: string) => {
  const resourceId = idExtractor(url);

  if (resourceId) {
    const tab = sdk.tabs.getTabs().find(t => t.url.includes(resourceId));

    if (tab) {
      await sdk.tabs.navToTab(tab.tabId);
    } else {
      // this line assume there is always 1 tab for notion app
      const applicationId = sdk.tabs.getTabs()[0].applicationId;
      return sdk.tabs.create({ url, applicationId });
    }
  }
};

const getMetadataHandler = (sdk: SDK) => async (url: string, defaultMetadata: resources.ResourceMetaData) => {
  const resourceId = idExtractor(url);
  const { id, label } = await getResource(resourceId, fetchPage, pageInfos, sdk);
  const { name } = await getResource(id, fetchPublicPageFromBlockId, publicPageToWorkspace, sdk);

  if (!label) {
    return defaultMetadata;
  }

  return {
    ...defaultMetadata,
    title: label,
    description: name,
  };
};

export const setResourcesHandlers = (sdk: SDK): Observable<Error> => {
  sdk.resources.setOpenHandler(getOpenHandler(sdk));
  sdk.resources.setMetaDataHandler(getMetadataHandler(sdk));
  return EMPTY;
};
