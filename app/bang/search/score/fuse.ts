// import {} from '../../lib/score-engine';

import * as Fuse from 'fuse.js';
import { getId } from './utils';
import { ScoreAlgorithm, ScoreMap } from '../../../lib/score-engine';
import { ScoreContext } from './types';
import { search } from '@getstation/sdk';

type FuseScored<T> = { item: T, score: number };

type Item = search.SearchResultItem;

// examples:
// 0.8 will be 0.2
// 0.1 will be 0.9
const inverseScore = (score: number) => Math.abs(score - 1);

const fuseOptions: Fuse.FuseOptions<Item> = {
  keys: ['label', 'additionalSearchString'],
  includeScore: true,
  shouldSort: false,
  threshold: 0.2,
};

/**
 * please see the readme for more details: `app/lib/score-engine/README.md`
 */
export const fuseScoreAlgorithm: ScoreAlgorithm<Item, ScoreContext> = (items: Item[], { query }: ScoreContext): ScoreMap => {
  if (!query) return {}; // empty scoremap means: all score equals to 0

  const fuse = new Fuse(items, fuseOptions);
  const scoredItems = fuse.search(query) as unknown as FuseScored<Item>[];

  return scoredItems.reduce((scoreMap, { item, score }) => {
    return {
      ...scoreMap,
      [getId(item)]: [inverseScore(score)],
    };
  }, {} as ScoreMap);
};
