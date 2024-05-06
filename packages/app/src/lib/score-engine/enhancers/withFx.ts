import { pipe, tap } from 'ramda';
import { ScoreAlgorithm, ScoreMap } from '../types';

/**
 * Apply a side effect function on the ScoreMap result
 * each time the algorithm function will be executed.
 *
 * Pretty useful for logging and debugging
 *
 * @param fx (scoreMap: ScoreMap) => void
 * @param algorithm ScoreAlgorithm<T>
 * @return ScoreAlgorithm<T>
 */
const withFx = <T, C extends {} = {}>(fx: (scoreMap: ScoreMap) => void, algorithm: ScoreAlgorithm<T, C>): ScoreAlgorithm<T, C> => pipe(
  algorithm,
  tap(fx),
);

export default withFx;
