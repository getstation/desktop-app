import { map, multiply, pipe } from 'ramda';
import { ScoreAlgorithm, ScoreMap } from '../types';

/**
 * Apply given weight to a ScoreMap result algorithm
 * To be efficient, scores returned by the algorithm should be bounded in the same range
 * For example, you can use `withPercentages` or `withStrictBound` on your algorithm to restrict scores between -1 and 1
 *
 * @param weight number
 * @param algorithm ScoreAlgorithm<T>
 * @return ScoreAlgorithm<T>
 */
const withWeight = <T, C extends {} = {}>(weight: number, algorithm: ScoreAlgorithm<T, C>): ScoreAlgorithm<T, C> => pipe(
  algorithm,
  map<ScoreMap, ScoreMap>(map(multiply(weight))),
);

export default withWeight;
