import { Dictionary } from 'ramda';

import { SCORE_KEY } from './constants';

export type Transformer<T, U = T> = (_: T) => U; // represents a basic pure transformation (a -> b)

export type ScoreMap = Dictionary<number[]>;

export type Scored<T> = T & {
  [SCORE_KEY]: number[],
};

export type ScoreOptions<K extends string, T extends { [key in K]: string }> = {
  idSelector: ((items: T) => T[K]) | K,
};

export type ScoreAlgorithm<T, C extends {} = {}> = (items: T[], context: C) => ScoreMap;
export type ScoreComputation<T, C extends {} = {}> = (items: T[], context: C) => Scored<T>[];
