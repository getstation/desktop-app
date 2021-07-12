
import { createSearchEngine, SearchEngine } from '../../../../../app/bang/search';
import { Loggers, FrecencyStorageProvider } from '../../../../../app/bang/search/score';
import { FrecencyData } from '../fixtures/types';
import { createInMemoryStorageProvider } from '../../../../../app/bang/search/providers';

const noop = () => {};

const createFakeStorageProvider = (frecencyData: FrecencyData): FrecencyStorageProvider => {
  const data = JSON.stringify(frecencyData);
  return {
    setItem: noop,
    getItem: () => data,
  };
};

export const createFakeSearchEngine = (data: FrecencyData, loggers?: Loggers): SearchEngine => {
  const contextualFrecencyStorageProvider = createFakeStorageProvider(data);
  const globalFrecencyStorageProvider = createInMemoryStorageProvider();

  return createSearchEngine({ contextualFrecencyStorageProvider, globalFrecencyStorageProvider }, loggers);
};
