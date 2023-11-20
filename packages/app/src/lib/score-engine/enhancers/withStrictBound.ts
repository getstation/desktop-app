import { compose, map, pipe, reduce, values, sum } from 'ramda';
import { ScoreAlgorithm, ScoreMap, Transformer } from '../types';
import { divideBy } from '../utils';

const getHighestAbsoluteValue = pipe(
  values,
  map(sum),
  map(Math.abs),
  reduce(Math.max, 0),
);

const computeBoundedScore: Transformer<ScoreMap> = (scoreMap) => {
  const highestScore = getHighestAbsoluteValue(scoreMap);
  if (highestScore === 0) return scoreMap;
  const transformScores: Transformer<number[]> = map(divideBy(highestScore));
  return map(transformScores, scoreMap);
};

/**
 * Restrict score range between -1 and 1
 * Compute bounded scores using the lowest possible divisor
 *
 * For example: `{ a: -250, b: 750 }` will be transformed into `{ a: -0.3333333333333333, b: 1.00 }`
 *
 * @param fn ScoreAlgorithm<T, C>
 * @return ScoreAlgorithm<T, C>
 */
const withStrictBound = <T, C extends {} = {}>(fn: ScoreAlgorithm<T, C>): ScoreAlgorithm<T, C> => compose(computeBoundedScore, fn);

export default withStrictBound;
