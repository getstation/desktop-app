import ScoreEngine, {
  pipeAlgorithms,
  ScoreAlgorithm,
  Scored,
  ScoreMap,
  withFx,
  withPercentages,
  withStrictBound,
  withWeight,
} from '../../../src/lib/score-engine';

type Item = { id: string };
const emptyContext = {};
const getId = (x: Item) => x.id;

const noopAlgorithm: ScoreAlgorithm<Item> = () => ({});
const dummyAlgorithm: ScoreAlgorithm<Item> = () => ({ dummy: [42] });

const contextAlgorithm: ScoreAlgorithm<Item, { score: number }> = (items: Item[], context: { score: number }) => {
  return items.reduce((scoreMap, item) => {
    return {
      ...scoreMap,
      [item.id]: [context.score],
    };
  }, {} as ScoreMap);
};

const incrementAlgorithm: ScoreAlgorithm<Item> = (items: Item[]) => {
  return items.reduce((scoreMap, item, i) => {
    return {
      ...scoreMap,
      [item.id]: [i + 1],
    };
  }, {} as ScoreMap);
};

describe('score-engine', () => {
  const items: Item[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  describe('ScoreEngine constructor', () => {
    test('noop algorithm', () => {
      const computeScore = ScoreEngine(noopAlgorithm, { idSelector: getId });

      expect(
        computeScore(items, emptyContext)
      ).toEqual([
        { id: 'a', _scores: [0] },
        { id: 'b', _scores: [0] },
        { id: 'c', _scores: [0] },
      ]);
    });

    test('idSelector can be a string', () => {
      const computeScore = ScoreEngine(noopAlgorithm, { idSelector: 'id' });

      expect(
        computeScore(items, emptyContext)
      ).toEqual([
        { id: 'a', _scores: [0] },
        { id: 'b', _scores: [0] },
        { id: 'c', _scores: [0] },
      ]);
    });

    test('with context', () => {
      const computeScore = ScoreEngine(contextAlgorithm, { idSelector: getId });

      expect(
        computeScore(items, { score: 42 })
      ).toEqual([
        { id: 'a', _scores: [42] },
        { id: 'b', _scores: [42] },
        { id: 'c', _scores: [42] },
      ]);
    });

    test('dummy algorithm', () => {
      const computeScore = ScoreEngine(dummyAlgorithm, { idSelector: getId });

      expect(
        computeScore([...items, { id: 'dummy' }], emptyContext)
      ).toEqual([
        { id: 'a', _scores: [0] },
        { id: 'b', _scores: [0] },
        { id: 'c', _scores: [0] },
        { id: 'dummy', _scores: [42] },
      ]);
    });

    test('additional score should be ignored', () => {
      const computeScore = ScoreEngine(dummyAlgorithm, { idSelector: getId });

      expect(
        computeScore([{ id: 'a' }], emptyContext)
      ).toEqual([
        { id: 'a', _scores: [0] },
      ]);
    });

    test('hoist given items and context', () => {});
  });

  describe('pipeAlgorithms', () => {
    test('1 algorithm', () => {
      const composedAlgorithm = pipeAlgorithms(incrementAlgorithm);
      expect(composedAlgorithm(items, emptyContext)).toEqual({ a: [1], b: [2], c: [3] });
    });

    test('2 algorithms', () => {
      const composedAlgorithm = pipeAlgorithms(incrementAlgorithm, incrementAlgorithm);
      expect(
        composedAlgorithm(items, emptyContext)
      ).toEqual({ a: [1, 1], b: [2, 2], c: [3, 3] });
    });

    test('4 algorithms', () => {
      const composedAlgorithm = pipeAlgorithms(
        incrementAlgorithm,
        incrementAlgorithm,
        incrementAlgorithm,
        dummyAlgorithm,
      );
      expect(composedAlgorithm(items, emptyContext)).toEqual({
        a: [1, 1, 1, 0],
        b: [2, 2, 2, 0],
        c: [3, 3, 3, 0],
        dummy: [0, 0, 0, 42],
      });
    });

    test('nested (with context)', () => {
      const composedAlgorithm = pipeAlgorithms(
        incrementAlgorithm,
        dummyAlgorithm,
        pipeAlgorithms(
          incrementAlgorithm,
          incrementAlgorithm,
        ),
        contextAlgorithm,
      );
      expect(composedAlgorithm(items, { score: 10 })).toEqual({
        a: [1, 0, 1, 1, 10],
        b: [2, 0, 2, 2, 10],
        c: [3, 0, 3, 3, 10],
        dummy: [0, 42, 0, 0, 0],
      });
    });
  });

  describe('withWeight', () => {
    test('weight 1 should not change scores', () => {
      const enhancedAlgorithm = withWeight(1, incrementAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap).toEqual(({ a: [1], b: [2], c: [3] }));
    });

    test('weight 10 should multiply score by 10', () => {
      const enhancedAlgorithm = withWeight(10, incrementAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap).toEqual(({ a: [10], b: [20], c: [30] }));
    });

    test('weight -1 should transform into negative score', () => {
      const enhancedAlgorithm = withWeight(-1, incrementAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap).toEqual(({ a: [-1], b: [-2], c: [-3] }));
    });

    test('weight -10 should transform into negative score', () => {
      const enhancedAlgorithm = withWeight(-10, incrementAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap).toEqual(({ a: [-10], b: [-20], c: [-30] }));
    });

    test('weight 0 should nullify score', () => {
      const enhancedAlgorithm = withWeight(0, incrementAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap).toEqual(({ a: [0], b: [0], c: [0] }));
    });

    test('weight 0.1 should divide final score', () => {
      const enhancedAlgorithm = withWeight(0.1, dummyAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap).toEqual(({ dummy: [4.2] }));
    });

    test('with context', () => {
      const enhancedAlgorithm = withWeight(2, contextAlgorithm);
      const scoremap = enhancedAlgorithm(items, { score: 21 });
      expect(scoremap).toEqual(({ a: [42], b: [42], c: [42] }));
    });
  });

  describe('withPercentages', () => {
    test('should apply bounding between -1 and 0', () => {
      const enhancedAlgorithm = withPercentages(incrementAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap.a[0]).toBeCloseTo(0.16666);
      expect(scoremap.b[0]).toBeCloseTo(0.33333);
      expect(scoremap.c[0]).toBe(0.5);
    });
    test('with context', () => {
      const enhancedAlgorithm = withPercentages(contextAlgorithm);
      const scoremap = enhancedAlgorithm(items, { score: 42 });
      expect(scoremap.a[0]).toBeCloseTo(0.33333);
      expect(scoremap.b[0]).toBeCloseTo(0.33333);
      expect(scoremap.c[0]).toBeCloseTo(0.33333);
    });
  });

  describe('withStrictBound', () => {
    test('should apply bounding between -1 and 0', () => {
      const enhancedAlgorithm = withStrictBound(incrementAlgorithm);
      const scoremap = enhancedAlgorithm(items, emptyContext);
      expect(scoremap.a[0]).toBeCloseTo(0.33333);
      expect(scoremap.b[0]).toBeCloseTo(0.66666);
      expect(scoremap.c[0]).toBe(1);
    });
    test('with context', () => {
      const enhancedAlgorithm = withStrictBound(contextAlgorithm);
      const scoremap = enhancedAlgorithm(items, { score: 42 });
      expect(scoremap).toEqual({ a: [1], b: [1], c: [1] });
    });
  });

  describe('withFx', () => {
    test('should execute given fx function with computed ScoreMap', () => {
      const fx = jest.fn(scoreMap => expect(scoreMap).toEqual({ dummy: [42] }));
      const enhancedAlgorithm = withFx(fx, dummyAlgorithm);
      expect(enhancedAlgorithm(items, {})).toEqual({ dummy: [42] });
      expect(fx.mock.calls.length).toBe(1);
    });

    test('with context', () => {
      const fx = jest.fn(scoreMap => expect(scoreMap).toEqual({ a: [42], b: [42], c: [42] }));
      const enhancedAlgorithm = withFx(fx, contextAlgorithm);
      expect(enhancedAlgorithm(items, { score: 42 })).toEqual({ a: [42], b: [42], c: [42] });
      expect(fx.mock.calls.length).toBe(1);
    });
  });

  describe('README Tutorial', () => {
    test('it should return expected score', () => {
      type TutorialItem = { id: string, label: string };
      type TutorialContext = { query: string };
      const countOccurences = (searchValue: string) => (base: string) => (base.match(new RegExp(searchValue, 'g')) || []).length;

      const lengthAlgorithm: ScoreAlgorithm<TutorialItem, TutorialContext> = (tutorialItems) => {
        return tutorialItems.reduce((scoreMap, item) => ({
          ...scoreMap,
          [item.id]: [item.label.length],
        }), {} as ScoreMap);
      };

      const queryCountAlgorithm: ScoreAlgorithm<TutorialItem, TutorialContext> = (tutorialItems, { query }) => {
        return tutorialItems.reduce((scoreMap, item) => ({
          ...scoreMap,
          [item.id]: [countOccurences(query)(item.label)],
        }), {} as ScoreMap);
      };

      const countZevia = countOccurences('Zevia');
      const zeviaCountAlgorithm: ScoreAlgorithm<TutorialItem, TutorialContext> = (tutorialItems) => {
        return tutorialItems.reduce((scoreMap, item) => ({
          ...scoreMap,
          [item.id]: [countZevia(item.label)],
        }), {} as ScoreMap);
      };

      const finalAlgorithm = pipeAlgorithms( // order does not matter
        withWeight(10, withPercentages(lengthAlgorithm)),
        withWeight(100, withPercentages(queryCountAlgorithm)),
        withWeight(1000, withPercentages(zeviaCountAlgorithm)),
      );

      const getTutorialId = (x: TutorialItem) => x.id;
      const computeScore = ScoreEngine(finalAlgorithm, { idSelector: getTutorialId });

      const inputItems = [
        { id: '0', label: '' },
        { id: '1', label: 'just a simple sentence' },
        { id: 'a', label: 'Station: one app to rule them all' },
        { id: 'b', label: 'every guys working at Station drink Zevia !' },
        { id: 'c', label: 'Station ! Station ! Station ! Station ! Station !' },
        { id: 'd', label: 'Zevia Zevia Zevia !' },
      ];

      const scoredItems: Scored<TutorialItem>[] = computeScore(inputItems, { query: 'Station' });

      expect(scoredItems).toEqual([
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
      ]);
    });
  });
});
