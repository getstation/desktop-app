# Score Engine 0.3 :signal_strength:
A practical and composable score computation engine for TypeScript

## Table of Contents

- [**Goals**](#goals)
  - [Write score algorithm as pure function](#write-score-algorithm-as-pure-function)
  - [Compose algorithms between them](#compose-algorithms-between-them)
- [**Documentation**](#documentation)
  - [Create a Score Engine](#create-a-scoreengine)
  - [Compose algorithms](#compose-algorithms)
  - [Configure algorithms](#configure-algorithms)
    - [withWeight](#withweight)
    - [withPercentages](#withpercentages)
    - [withStrictBound](#withstrictbound)
    - [withFx](#withfx)
- [**Tutorial**](#tutorial)
- [**FAQ**](#faq)

## Goals
`score-engine` propose a functional pattern and bring utilities in order to orchestrate multi-scoring behavior.

All of the strength of `score-engine` is to not implement specific algorithm and let the user choose his implementation. Ref: [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns).

#### Write score algorithm as pure function
```typescript
type Item = { id: string, label: string };

const lengthAlgorithm = (items: Item[], context: any) => {
  return items.reduce((scoreMap, item) => ({
    ...scoreMap,
    [item.id]: [item.label.length],
  }), {} as ScoreMap);
}
```

A score algorithm is a just a pure function that take several items of type T, a context of type C and return a `ScoreMap`.

Please note:
- A `ScoreMap` is a `Record<string, number[]>`, it represents several scores indexed by item id.
- All items should have an uniq `id` as score identifier.


#### Compose algorithms between them
There are several `score algorithms enhancers` which allow you to customize your algorithm.

With them, you can compose algorithms between them, apply weighting and bounding.

-------------------------------------------------------

## Documentation

### Create a ScoreEngine

```typescript
import ScoreEngine from 'score-engine';

type Item = { id: string }
type Context = {};

const noopAlgorithm = () => ({});
const computeScore = ScoreEngine(noopAlgorithm, { idSelector: (x: Item) => x.id });
// or ScoreEngine(noopAlgorithm, { idSelector: 'id' });

const items: Item[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
const context: Context = {};
const scoredItems = computeScore(items, context); // return (Item & { _scores: [string] })[]

console.log(scoredItems[0]._scores); // all items score are equals to [0] because noopAlgorithm
```

Please see the tutorial for more details.

### Compose algorithms

Compose several algorithm into one, each `scoreMap` is computed separately and all corresponding scores are summed.
````typescript
import { pipeAlgorithms } from 'score-engine';

const finalAlgorithm = pipeAlgorithms(
  algo1,
  algo2,
  algo3,
  pipeAlgorithms( // can be nested
    algo4,
    algo4,
  ),
);
````

To have relevant scores, you have to be careful with proportions, every score algorithm should compute score in the same bound.

For example, it's a non-sense to compose 2 algorithms if `algo1` compute score between 0 and 10 and `algo2` compute score between 0 and 1.

To keep proportions, you have 3 solutions :
- weighting using `withWeight`
- bounding using `withPercentages`
- bounding using `withStrictBound`



### Configure algorithms
#### withWeight
Apply a given weight to a score algorithm.

```typescript
import { withWeight } from 'score-engine';

const newAlgorithm = withWeight(100, myAlgorithm)
```
- For example: `{ a: [-0.25], b: [0.75] }` will be transformed into `{ a: [-25], b: [75] }`

#### withPercentages
Compute bounded percentages score using the sum of all absolute scores.

This enhancer restrict score range between -1 and 1.

- For example: `{ a: [-250], b: [750] }` will be transformed into `{ a: [-0.25], b: [0.75] }`


#### withStrictBound
Compute bounded score using the lowest possible divisor.

This enhancer restrict score range between -1 and 1

 - For example: `{ a: [-250], b: [750] }` will be transformed into
 `{ a: [-0.3333333333333333], b: [1.00] }`
 
 #### withFx
 Apply a side effect function to the ScoreMap result.
 
 
```typescript
import { withFx } from 'score-engine';
const myAlgorithm = () => ({}); // any score algorithm

const myAlgorithmWithLog = withFx(x => console.log(x), myAlgorithm);
``` 

-------------------------------------------------------

## Tutorial

Through this dummy example, you'll be able to write your own algorithms.

The goal here is to write and configure 3 algorithms :
1. one that compute score as item string length
2. one that count contextual occurences (using context.query)
3. one that count hardcoded "zevia" occurences

For the example, we need this imports: 
```typescript
import ScoreEngine, { ScoreMap, ScoreAlgorithm, withWeight, withPercentages, pipeAlgorithms } from 'score-engine';
```

We take back this type:
```typescript
type Item = { id: string, label: string };
```

we will use a very simple Context type:
```typescript
type Context = { query: string };
```

and we need this utility function:
```typescript
const countOccurences = (searchValue: string) => (base: string) => (base.match(new RegExp(searchValue, 'g')) || []).length;
```

#### 1. lengthAlgorithm
```typescript
const lengthAlgorithm: ScoreAlgorithm<Item, Context> = (items) => {
  return items.reduce((scoreMap, item) => ({
    ...scoreMap,
    [item.id]: [item.label.length],
  }), {} as ScoreMap);
}
```

#### 2. queryCountAlgorithm
```typescript
const queryCountAlgorithm: ScoreAlgorithm<Item, Context> = (items, { query }) => {
  return items.reduce((scoreMap, item) => ({
    ...scoreMap,
    [item.id]: [countOccurences(query)(item.label)],
  }), {} as ScoreMap);
}
```

#### 3. zeviaCountAlgorithm
```typescript
const countZevia = countOccurences('Zevia');
const zeviaCountAlgorithm: ScoreAlgorithm<Item, Context> = (items) => {
  return items.reduce((scoreMap, item) => ({
    ...scoreMap,
    [item.id]: [countZevia(item.label)],
  }), {} as ScoreMap);
}
```


#### Configuration
All of this algorithm should be bounded between 0 and 1 (using `withPercentages` enhancer).
First algorithm should have a weight of 10, second of 100, and third of 1000.


```typescript
const finalAlgorithm = pipeAlgorithms( // order does not matter
  withWeight(10, withPercentages(lengthAlgorithm)),
  withWeight(100, withPercentages(queryCountAlgorithm)),
  withWeight(1000, withPercentages(zeviaCountAlgorithm)),
);

const computeScore = ScoreEngine(finalAlgorithm, { idSelector: 'id' });
```

**Please note**: `withWeight` must be the last enhancer to be applied.

#### Usage
```typescript
const items: Item[] = [
  { id: '0', label: '' },
  { id: '1', label: 'just a simple sentence' },
  { id: 'a', label: 'Station: one app to rule them all' },
  { id: 'b', label: 'every guys working at Station drink Zevia !' },
  { id: 'c', label: 'Station ! Station ! Station ! Station ! Station !' },
  { id: 'd', label: 'Zevia Zevia Zevia !' },
];

const scoredItems: Scored<Item>[] = computeScore(items, { query: 'Station' });

console.log(scoredItems);

/*
[
  {
    id: '0',
    label: '',
    _scores: [0, 0, 0],
  },
  {
    id: '1',
    label: 'just a simple sentence',
    _scores: [1.3253012048192772, 0, 0],
  },
  {
    id: 'a',
    label: 'Station: one app to rule them all',
    _scores: [
      1.9879518072289157,
      14.285714285714285,
      0,
    ],
  },
  { 
    id: 'b',
    label: 'every guys working at Station drink Zevia !',
    _scores: [
      2.5903614457831328,
      14.285714285714285,
      250,
    ],
  },
  {
    id: 'c',
    label: 'Station ! Station ! Station ! Station ! Station !',
    _scores: [
      2.951807228915663,
      71.42857142857143,
      0,
    ],
  },
  {
    id: 'd',
    label: 'Zevia Zevia Zevia !',
    _scores: [
      1.144578313253012,
      0,
      750,
    ],
  },
]
*/
```

As you can see in `_scores`, there are 3 computed score for each item.
Each score represent a single score algorithm result, applied in the order of composed algorithms in `pipeAlgorithms`.
So it let you compute your final score with a custom strategy, e.g.

```typescript
const getFinalScore = (item: Scored<Item>): number => {
  const [lengthScore, queryScore, zeviaScore] = item._scores;
  return (lengthScore || 1) * (queryScore + zeviaScore);
};

const finalScoredItems = scoredItems.map(item => ({
  ...item,
  _scores: [getFinalScore(item)],
}));
```

-------------------------------------------------------

## FAQ
#### **Does score-engine support asynchronous algorithms ?**
> No, score-engine intends to be a pure synchronous library

#### **Does score-engine provide any algorithms ?**
> No, but we plan to provide generic algorithm factories in the future. (fusejs integration, frecency scoring, and so on...)

#### **How my algorithm can produce side effects and stay pure ?**
> You can use [Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)
using context second argument of your algorithm.

```typescript
import { readFileSync } from 'fs';
const context = { readFileSync };
```

#### **How my algorithm can produce side effects and stay pure without context ?**
> It's possible to make an algorithm factory using [Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) by [Currying](https://en.wikipedia.org/wiki/Currying).
```typescript
const myAlgorithmFactory = (fs) => (items) => {
  // algorithm implementation
}
```
*Please note you cannot configure or compose an algorithm factory, you have to create an algorithm  with it,
that's the main difference between using context and using factory.*


#### **Can I write my own score algorithm enhancer ?**
> Yes, a *score algorithm enhancer* (or *higher order score algorithm*)
is just a function that take a score algorithm and return a score algorithm.

example:

```typescript
const myAlgorithm = () => ({}); // any score algorithm

// This function take a threshold and a score algorithm and return a new score algorithm
// filtering all scores which be lower than threshold
const withThreshold = (threshold, algorithm) => (items, context) => {
  const scoreMap = algorithm(items, context);
  return Object.keys(scoreMap).reduce((finalScoreMap, id) => {
    const score = scoreMap[id];
    return {
      ...finalScoreMap,
      [id]: [score >= threshold ? score : 0],
    };
  }, {} as ScoreMap);
}

const myAlgorithmWithThreshold = withThreshold(0.5, myAlgorithm)
```

#### **Is this library is related to [Fisher's scoring](https://en.wikipedia.org/wiki/Scoring_algorithm) ?**
> Absolutely not
