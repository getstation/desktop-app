import { SDK } from '@getstation/sdk';
import memoizee = require('memoizee');
import fetch from 'node-fetch';
import { serviceDomain } from '../main';
import { authCookies } from './cookies';
import { fetchCollection } from './methods';

export const enum Endpoint {
  loadUserContent = '/api/v3/loadUserContent',
  getPublicPageData = '/api/v3/getPublicPageData',
  searchPages = '/api/v3/searchPages',
  searchCollections = '/api/v3/searchCollections',
  getRecord = '/api/v3/getRecordValues',
}

const fetchApi = memoizee(
  async (endpoint: Endpoint, body: string, sdk: SDK) => {
    const response = await fetch(
      `${serviceDomain}${endpoint}`,
      {
        headers: {
          Credentials: 'include',
          Origin: `${serviceDomain}`,
          Accept: '*/*',
          'Content-Type': 'application/json',
          'Accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,fr;q=0.7',
          'User-agent': await sdk.session.getUserAgent(),
          Cookie: (await authCookies(sdk)),
        },
        method: 'POST',
        body: body,
      });

    return await response.json();
  },
  {
    length: 2,
    maxAge: 30000,
    promise: true,
  }
);

const collectionFilter = ({ value }) =>
  value.type && (value.type === 'collection_view_page' || value.type === 'collection_view');

export const getResource =
  async (params: any, fetcher: Function, transformer: Function, sdk: SDK) => {
    const { endpoint, body } = fetcher(params);
    const results = await fetchApi(endpoint, JSON.stringify(body), sdk);

    // Weird block code for a weird data schema from the API...
    if (endpoint === Endpoint.getRecord) {
      const collectionViewPages = results.results.filter(collectionFilter);

      if (collectionViewPages.length > 0) {
        const mergedResults = results.results.filter(r => !collectionFilter(r));

        for (const collectionViewPage of collectionViewPages) {
          const collectionFetcher = fetchCollection(collectionViewPage.value.collection_id);
          const collection = await fetchApi(collectionFetcher.endpoint, JSON.stringify(collectionFetcher.body), sdk);
          collection.results[0].value.id = collectionViewPage.value.id;

          mergedResults.push(transformer(collection));
        }

        if (mergedResults.length > 1) return mergedResults;
        return mergedResults[0];
      }
    }

    return transformer(results);
  };
