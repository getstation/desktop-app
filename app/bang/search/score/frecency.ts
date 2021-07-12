// @ts-ignore: no declaration file
import * as Frecency from '@getstation/frecency';
import { ScoreAlgorithm, ScoreMap, withPercentages } from '../../../lib/score-engine';
import { ScoreContext } from './types';
import { getId } from './utils';
import { search } from '@getstation/sdk';

type FrecencyScored<T> = T & { _frecencyScore: number };
type Item = search.SearchResultItem;

/**
 * it can be a LocalStorage
 */
export type FrecencyStorageProvider = {
  setItem: (key: string, value: string) => void,
  getItem: (key: string) => string | null,
};

/**
 * Minimum typing for `frecency` library
 */
export type FrecencyEngine = {
  save: (saveParams: { searchQuery?: string, selectedId: string, dateSelection?: Date }) => void,
  sort: (sortParams: { searchQuery?: string, results: object[], keepScores?: boolean }) => any[],
};

export type FrecencyEnv = {
  frecencyEngine: FrecencyEngine,
};

/**
 * related documentation: https://github.com/mixmaxhq/frecency#configure-weights
 */
export type FrecencyWeightOptions = {
  /**
   * When query match totally a selection (contextual frecency only)
  */
  exactQueryMatchWeight?: number,

  /**
   * When query match partially a selection (contextual frecency only)
  */
  subQueryMatchWeight?: number,

  /**
   * When query is empty or does not match but a selection is found (global+contextual frecency)
  */
  recentSelectionsMatchWeight?: number,
};

/**
 * configure a frecency engine
 */
export const getFrecencyEnv = (storageProvider: FrecencyStorageProvider, weightOptions: FrecencyWeightOptions = {}): FrecencyEnv => {
  const frecencyEngine: FrecencyEngine = new Frecency({
    key: 'quick_switch_results',
    idAttribute: getId,
    storageProvider,
    ...weightOptions,
  });

  return { frecencyEngine };
};

/**
 * this is just a binding between `score-engine` and `frecency` libraries
 * please see the readme for more details: `app/lib/score-engine/README.md`
 */
export const createFrecencyAlgorithm = (env: FrecencyEnv): ScoreAlgorithm<Item, ScoreContext> => {
  return withPercentages((items: Item[], { query }: ScoreContext): ScoreMap => {
    // WARNING: contextualFrecency.sort mutates shamefully passed items, it adds a '_frecencyScore' property to items
    const scoredItems: FrecencyScored<Item>[] = env.frecencyEngine.sort({ keepScores: true, searchQuery: query, results: items });

    return scoredItems.reduce((scoreMap, item) => {
      return {
        ...scoreMap,
        [getId(item)]: [item._frecencyScore],
      };
    }, {} as ScoreMap);
  });
};
