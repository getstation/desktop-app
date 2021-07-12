import { Endpoint } from './api';
import { unstripUuid } from './helpers';
import { Workspace } from './transformer';

export const fetchUserContent = () => ({
  endpoint: Endpoint.loadUserContent,
  body: {},
});

export const fetchPublicPageFromBlockId = (blockId: string) => ({
  endpoint: Endpoint.getPublicPageData,
  body: {
    blockId,
  },
});

export const fetchPage = (pageId: string) => ({
  endpoint: Endpoint.getRecord,
  body: {
    requests: [{ table: 'block', id: unstripUuid(pageId) }],
  },
});

export const fetchCollection = (collectionId: string) => ({
  endpoint: Endpoint.getRecord,
  body: {
    requests: [{ table: 'collection', id: unstripUuid(collectionId) }],
  },
});

export const fetchSearchPages = (
  params: {
    query: string,
    spaceId: Workspace['id'],
    limit: number,
  }) => ({
    endpoint: Endpoint.searchPages,
    body: params,
  });

export const fetchSearchCollections = (
  params: {
    query: string,
    spaceId: Workspace['id'],
    limit: number,
  }) => ({
    endpoint: Endpoint.searchCollections,
    body: params,
  });
