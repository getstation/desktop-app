import { map, propOr, assoc } from 'ramda';
import { SCORE_KEY } from './constants';
import { ScoreAlgorithm, ScoreComputation, Scored, ScoreMap, ScoreOptions, Transformer } from './types';

const applyScoreMap = <K extends string, T extends { [key in K]: string }>(
  scoreMap: ScoreMap,
  { idSelector }: ScoreOptions<K, T>,
  items: T[],
): Scored<T>[] => {
  const createScoredItem: Transformer<T, Scored<T>> = (item: T) => {
    const getId = typeof idSelector === 'function' ? idSelector : (x: T) => x[idSelector];
    const getScores: Transformer<ScoreMap, [number]> = propOr([0], getId(item));
    const scores = getScores(scoreMap);

    return assoc(SCORE_KEY, scores, item);
  };
  return map(createScoredItem, items);
};

/**
 * Create a score computation function from a given algorithm
 *
 * @param algorithm ScoreAlgorithm<T, C>
 * @param options ScoreOptions<K>
 * @return ScoreComputation<T, C>
 */
const scoreEngine = <K extends string, T extends { [key in K]: string }, C>(
  algorithm: ScoreAlgorithm<T, C>,
  options: ScoreOptions<K, T>,
): ScoreComputation<T, C> => {
  return (items: T[], context: C) => {
    const scoreMap: ScoreMap = algorithm(items, context);
    return applyScoreMap(scoreMap, options, items);
  };
};

export default scoreEngine;
