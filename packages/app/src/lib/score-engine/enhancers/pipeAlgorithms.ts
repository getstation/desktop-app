import { compose, map, mergeWith, reduce, concat, repeat } from 'ramda';
import { ScoreAlgorithm, ScoreMap, Transformer } from '../types';

const mergeConcat = mergeWith(concat);

const getNbMaxScores = (scoreMap: ScoreMap): number =>
  Object.values(scoreMap).reduce((nbMaxScore, scores) => (
    nbMaxScore >= scores.length ? nbMaxScore : scores.length
  ), 0);

const arrayPadEnd = <T>(arr: T[], neededSize: number, value: T): T[] => {
  const repeatValue = repeat(value);
  if (neededSize <= arr.length) return arr;
  return arr.concat(repeatValue(neededSize));
};

const assignEmptyArrayIfNoProps = (keys: string[]): Transformer<ScoreMap> => (scoreMap) =>
  reduce((acc: ScoreMap, key: string) => {
    if (acc[key]) return acc;
    return { ...acc, [key]: [] };
  }, scoreMap, keys);

const ensureConsistentScoreMap: Transformer<ScoreMap> = (scoreMap) => {
  const nbMaxScores = getNbMaxScores(scoreMap);
  return map(scores => arrayPadEnd(scores, nbMaxScores, 0), scoreMap);
};

const mergeScoreMaps: Transformer<ScoreMap[], ScoreMap> = reduce((scoreMapA, scoreMapB) => {
  const allKeys = Object.keys(scoreMapA).concat(Object.keys(scoreMapB));
  const transform = compose(ensureConsistentScoreMap, assignEmptyArrayIfNoProps(allKeys));
  return mergeConcat(transform(scoreMapA), transform(scoreMapB));
}, {} as ScoreMap);

/**
 * Compose several ScoreAlgorithm into one
 *
 * @param<T, C> ScoreAlgorithm<T, C>[]
 * @return ScoreAlgorithm<T, C>
 */
const pipeAlgorithms = <T, C extends {} = {}>(...algorithms: ScoreAlgorithm<T, C>[]): ScoreAlgorithm<T, C> => {
  return (items: T[], context: C) => {
    const scoreMaps = algorithms.map(algo => algo(items, context));
    return mergeScoreMaps(scoreMaps);
  };
};

export default pipeAlgorithms;
