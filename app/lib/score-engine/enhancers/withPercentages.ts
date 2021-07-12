import { compose, map, sum, values } from 'ramda';

import { ScoreAlgorithm, ScoreMap, Transformer } from '../types';
import { divideBy } from '../utils';

const sumAbsoluteValues = compose(sum, map(Math.abs), map(sum), values);

const computePercentagesScore: Transformer<ScoreMap> = (scoreMap) => {
  const totalScore = sumAbsoluteValues(scoreMap);
  if (totalScore === 0) return scoreMap;
  const transformScores: Transformer<number[]> = map(divideBy(totalScore));
  return map(transformScores, scoreMap);
};

/**
 * Restrict score range between -1 and 0
 * Compute bounded percentages score using the sum of all absolute scores
 *
 * For example: `{ a: -250, b: 750 }` will be transformed into `{ a: -0.25, b: 0.75 }`
 *
 * @param fn ScoreAlgorithm<T>
 * @return ScoreAlgorithm<T>
 */
const withPercentages = <T, C extends {} = {}>(fn: ScoreAlgorithm<T, C>): ScoreAlgorithm<T, C> => compose(computePercentagesScore, fn);

export default withPercentages;
