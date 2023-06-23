import {
  applyTo,
  compose,
  identity,
  negate,
  pipe,
  filter,
  sortBy,
  take
} from 'ramda';

import { Transformer } from '../../utils/fp';
import createComputeScore, {
  Loggers,
  getFrecencyEnv,
  getTotalScore
} from './score';
import { FrecencyWeightOptions } from './score/frecency';
import {
  WEIGHT_CONTEXTUAL_FRECENCY_RECENT_SELECTIONS_MATCH,
  WEIGHT_GLOBAL_FRECENCY_RECENT_SELECTIONS_MATCH
} from './score/config';

import {
  ScoredItem,
  SearchFunction,
  SaveGlobalSelectionFunction,
  SaveContextualSelectionFunction,
  SearchEngine,
  SearchEngineEnv
} from './types';

const defaultLoggers: Loggers = {
  fuseLogger: identity,
  contextualFrecencyLogger: identity,
  globalFrecencyLogger: identity
};

const contextualFrecencyOptions: FrecencyWeightOptions = {
  recentSelectionsMatchWeight: WEIGHT_CONTEXTUAL_FRECENCY_RECENT_SELECTIONS_MATCH
};

const globalFrecencyOptions: FrecencyWeightOptions = {
  recentSelectionsMatchWeight: WEIGHT_GLOBAL_FRECENCY_RECENT_SELECTIONS_MATCH
};

const hasPositiveScore = (scoredItem: ScoredItem) =>
  getTotalScore(scoredItem) > 0;

/**
 * This function create a SearchEngine, it needs a contextual FrecencyStorageProvider
 * and a global FrecencyStorageProvider in order to work.
 *
 * expose a search function and 2 methods to save selections (global or contextual)
 */
export const createSearchEngine = (
  searchEngineEnv: SearchEngineEnv,
  loggers: Loggers = defaultLoggers
): SearchEngine => {
  const contextual = getFrecencyEnv(
    searchEngineEnv.contextualFrecencyStorageProvider,
    contextualFrecencyOptions
  );
  const global = getFrecencyEnv(
    searchEngineEnv.globalFrecencyStorageProvider,
    globalFrecencyOptions
  );

  const computeScore = createComputeScore({ contextual, global }, loggers);

  const searchFn: SearchFunction = (items, context, limit) => {
    const scoredItems: ScoredItem[] = computeScore(items, context);

    return applyTo(scoredItems)(
      pipe(
        sortBy(
          compose(
            negate,
            getTotalScore
          )
        ), // negate scores in order to make a descending sort
        filter(hasPositiveScore) as Transformer<ScoredItem[]>,
        take(limit) as Transformer<ScoredItem[]>
      )
    );
  };

  const saveContextualSelection: SaveContextualSelectionFunction = saveParams => {
    return contextual.frecencyEngine.save(saveParams);
  };

  const saveGlobalSelection: SaveGlobalSelectionFunction = (
    selectedId,
    dateSelection
  ) => {
    return global.frecencyEngine.save({
      searchQuery: '',
      selectedId,
      dateSelection
    });
  };

  return { search: searchFn, saveContextualSelection, saveGlobalSelection };
};
