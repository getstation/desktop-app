
import { search } from '@getstation/sdk';

import { Scored } from '../../lib/score-engine';
import { FrecencyStorageProvider, ScoreContext } from './score';

export type Item = search.SearchResultItem;
export type ScoredItem = Scored<Item>;

/**
 * 1. compute score on each items depending on `context.query`
 * 2. sort results by scores
 * 3. limit results
*/
export type SearchFunction = (items: Item[], context: ScoreContext, limit: number) => ScoredItem[];

/**
 * save a global selection (every bx activities) at a given date
*/
export type SaveGlobalSelectionFunction = (selectedId: string, dateSelection: Date) => void;

/**
 * save a contextual selection (a search made in the QuickSwitch) with his query
 * `Date.now()` is used internally by the `frecency` library
*/
export type SaveContextualSelectionFunction =
  (saveParams: { selectedId: string, searchQuery: string }) => void;

/**
 * created with `createSearchEngine`
*/
export type SearchEngine = {
  search: SearchFunction,
  saveContextualSelection: SaveContextualSelectionFunction,
  saveGlobalSelection: SaveGlobalSelectionFunction,
};

/**
 * env needed by `createSearchEngine`
 * a `FrecencyStorageProvider` can be a LocalStorage or any custom instance.
 */
export type SearchEngineEnv = {
  contextualFrecencyStorageProvider: FrecencyStorageProvider,
  globalFrecencyStorageProvider: FrecencyStorageProvider,
};
