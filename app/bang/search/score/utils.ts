import { prop, pathOr } from 'ramda';
import { Item, ScoredItem } from '../types';
import { SCORE_KEY } from '../../../lib/score-engine';

type ScoreGetter = (item: Item | ScoredItem) => number;

const getFuseScore: ScoreGetter = pathOr(0, [SCORE_KEY, 0]);
const getContextualFrecencyScore: ScoreGetter = pathOr(0, [SCORE_KEY, 1]);
const getGlobalFrecencyScore: ScoreGetter = pathOr(0, [SCORE_KEY, 2]);

const getFrecencyScore: ScoreGetter = (item) => {
  return getContextualFrecencyScore(item) + getGlobalFrecencyScore(item);
};

export const getId = prop('resourceId');

export const getTotalScore: ScoreGetter = (item) => {
  return getFuseScore(item) + getFrecencyScore(item);
};
