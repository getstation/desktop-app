import { createContextualFrecencyStorageProvider, createInMemoryStorageProvider } from './providers';
import { createSearchEngine } from './searchEngine';
import loggers from './loggers';

export * from './searchEngine';
export * from './types';
export { feedGlobalFrecencyStorage } from './providers';

const createBxSearchEngine = () => {
  const contextualFrecencyStorageProvider = createContextualFrecencyStorageProvider();
  const globalFrecencyStorageProvider = createInMemoryStorageProvider();

  return createSearchEngine({
    contextualFrecencyStorageProvider,
    globalFrecencyStorageProvider,
  }, loggers);
};

export default createBxSearchEngine;
