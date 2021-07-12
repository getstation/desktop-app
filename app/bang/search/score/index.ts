import { getId, getTotalScore } from './utils';
import ScoreEngine, { pipeAlgorithms, withFx, withWeight, ScoreMap, ScoreOptions } from '../../../lib/score-engine';
import { WEIGHT_CONTEXTUAL_FRECENCY, WEIGHT_GLOBAL_FRECENCY, WEIGHT_FUSE } from './config';
import { createFrecencyAlgorithm, FrecencyEnv, getFrecencyEnv, FrecencyStorageProvider } from './frecency';
import { fuseScoreAlgorithm } from './fuse';
import { ScoreContext } from './types';
import { search } from '@getstation/sdk';

export { FrecencyEnv, getFrecencyEnv, FrecencyStorageProvider, ScoreContext, getTotalScore };

export const FRECENCY_VERSION = 'frecency-v2';

export type AlgorithmLogger = (scoreMap: ScoreMap) => void;

export type ScoreAlgorithmEnv = {
  contextual: FrecencyEnv,
  global: FrecencyEnv,
};

// all side effects are externalized to keep the code pure
export type Loggers = {
  fuseLogger: AlgorithmLogger,
  contextualFrecencyLogger: AlgorithmLogger,
  globalFrecencyLogger: AlgorithmLogger,
};

const getScoreOptions = (): ScoreOptions<'resourceId', search.SearchResultItem> => ({
  idSelector: getId,
});

/**
 * create the final score algorithm using `score-engine` library
 *
 * for each algorithms, corresponding weights and loggers are applied:
 * 1. fuse
 * 2. contextual frecency
 * 3. global frecency
 *
 * please see the readme for more details: `app/lib/score-engine/README.md`
*/
const createStationScoreAlgorithm = (loggers: Loggers, env: ScoreAlgorithmEnv) => {
  const contextualFrecencyAlgorithm = createFrecencyAlgorithm(env.contextual);
  const globalFrecencyAlgorithm = createFrecencyAlgorithm(env.global);

  return pipeAlgorithms(
    withFx(loggers.fuseLogger, withWeight(WEIGHT_FUSE, fuseScoreAlgorithm)),
    withFx(loggers.contextualFrecencyLogger, withWeight(WEIGHT_CONTEXTUAL_FRECENCY, contextualFrecencyAlgorithm)),
    withFx(loggers.globalFrecencyLogger, withWeight(WEIGHT_GLOBAL_FRECENCY, globalFrecencyAlgorithm)),
  );
};

const createComputeScore = (env: ScoreAlgorithmEnv, loggers: Loggers) =>
  ScoreEngine<'resourceId', search.SearchResultItem, ScoreContext>(
    createStationScoreAlgorithm(loggers, env),
    getScoreOptions(),
  );

export default createComputeScore;
