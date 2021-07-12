import { search } from '@getstation/sdk';
import { SearchConsumer } from '@getstation/sdk/lib/search/consumer';
import { Subscription } from 'rxjs/Subscription';
import SearchProvider from '../../../app/sdk/search/SearchProvider';

jest.useFakeTimers();

const resultBuilder = (id: string, category: string): search.SearchResultItem => {
  return {
    resourceId: id,
    category,
    url: '',
    label: '',
    context: '',
    imgUrl: '',
  };
};

let data!: {
  consumer1: search.SearchConsumer,
  consumer2: search.SearchConsumer,
  consumer3: search.SearchConsumer,
};

let provider!: SearchProvider;

const results = {
  r1: resultBuilder('r1', 'cat1'),
  r2: resultBuilder('r2', 'cat1'),
  r3: resultBuilder('r3', 'cat1'),
  r4: resultBuilder('r4', 'cat2'),
  r5: resultBuilder('r5', 'cat2'),
  r6: resultBuilder('r6', 'cat2'),
};

beforeAll(() => {
  provider = new SearchProvider();
  const consumer1 = new SearchConsumer('1');
  const consumer2 = new SearchConsumer('2');
  const consumer3 = new SearchConsumer('3');
  provider.addConsumer(consumer1);
  provider.addConsumer(consumer2);
  provider.addConsumer(consumer3);
  data = {
    consumer1,
    consumer2,
    consumer3,
  };
});

describe('forwarding', () => {
  const subscriptions: Subscription[] = [];

  afterEach(async () => {
    // Unscubscribe
    subscriptions.forEach(s => s.unsubscribe());
    // Reset to default values
    data.consumer1.results.next({});
    data.consumer2.results.next({});
    data.consumer3.results.next({});
    provider.query.next({ value: '' });
    jest.advanceTimersByTime(60);
  });

  test('query is forwarded to consumers', () => {
    expect.assertions(6);

    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const mockCallback3 = jest.fn();

    subscriptions.push(data.consumer1.query.subscribe(mockCallback1));
    subscriptions.push(data.consumer2.query.subscribe(mockCallback2));
    subscriptions.push(data.consumer3.query.subscribe(mockCallback3));

    expect(mockCallback1.mock.calls[0][0]).toEqual({ value: '' });
    expect(mockCallback2.mock.calls[0][0]).toEqual({ value: '' });
    expect(mockCallback3.mock.calls[0][0]).toEqual({ value: '' });

    provider.query.next({ value: 'test' });

    expect(mockCallback1.mock.calls[1][0]).toEqual({ value: 'test' });
    expect(mockCallback2.mock.calls[1][0]).toEqual({ value: 'test' });
    expect(mockCallback3.mock.calls[1][0]).toEqual({ value: 'test' });
  });

  test('results are forwarded to provider (with 50ms debounce)', async () => {
    expect.assertions(4);
    let count = 0;

    subscriptions.push(provider.results.subscribe((v) => {
      switch (count) {
        case 0:
          expect(v).toEqual([]);
          break;
        case 1:
          expect(v).toEqual([
            {
              sectionName: 'cat1',
              loading: false,
              results: [results.r1, results.r2],
            },
          ]);
          break;
        case 2:
          expect(v).toEqual([
            {
              sectionName: 'cat1',
              loading: false,
              results: [results.r1, results.r2, results.r3],
            },
            {
              sectionName: 'cat2',
              loading: false,
              results: [results.r4],
            },
          ]);
          break;
        case 3:
          expect(v).toEqual([
            {
              sectionName: 'cat1',
              loading: false,
              results: [results.r1, results.r2, results.r3],
            },
            {
              sectionName: 'cat2',
              loading: false,
              results: [results.r4, results.r5, results.r6],
            },
          ]);
          break;
        default:
          throw new Error();
      }
      count += 1;
    }));

    data.consumer1.results.next({ results: [results.r1] });
    data.consumer1.results.next({ results: [results.r1, results.r2] });
    jest.advanceTimersByTime(60);

    data.consumer2.results.next({ results: [results.r3] });
    data.consumer2.results.next({ results: [results.r3, results.r4] });
    jest.advanceTimersByTime(60);

    data.consumer3.results.next({ results: [results.r6] });
    data.consumer3.results.next({ results: [results.r5, results.r6] });
    jest.advanceTimersByTime(60);
  });

  test('only last result of each consumer is available in provider', async () => {
    expect.assertions(4);
    let count = 0;

    subscriptions.push(provider.results.subscribe((v) => {
      switch (count) {
        case 0:
          expect(v).toEqual([]);
          break;
        case 1:
          expect(v).toEqual([
            {
              sectionName: 'cat1',
              loading: false,
              results: [results.r1, results.r2],
            },
          ]);
          break;
        case 2:
          expect(v).toEqual([
            {
              sectionName: 'cat1',
              loading: false,
              results: [results.r1, results.r2, results.r3],
            },
            {
              sectionName: 'cat2',
              loading: false,
              results: [results.r4],
            },
          ]);
          break;
        case 3:
          expect(v).toEqual([
            {
              sectionName: 'cat1',
              loading: true,
              results: [results.r3],
            },
            {
              sectionName: 'cat2',
              loading: false,
              results: [results.r4],
            },
          ]);
          break;
        default:
          throw new Error();
      }
      count += 1;
    }));

    data.consumer1.results.next({ results: [results.r1] });
    data.consumer1.results.next({ results: [results.r1, results.r2] });
    jest.advanceTimersByTime(60);

    data.consumer2.results.next({ results: [results.r3] });
    data.consumer2.results.next({ results: [results.r3, results.r4] });
    jest.advanceTimersByTime(60);

    data.consumer1.results.next({ results: [results.r3] });
    data.consumer1.results.next({ loading: 'cat1' });
    jest.advanceTimersByTime(60);
  });

});
