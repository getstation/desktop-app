import { from, Observable } from 'rxjs';
import { activity } from '@getstation/sdk/lib/activity';
import createActivityObservable, { Options } from '../../../../app/sdk/activity/createActivityObservable';
import { GlobalActivityEntry } from '../../../../app/sdk/activity/types';
import ActivityEntry = activity.ActivityEntry;

const createDummyGlobalActivityEntry = (createdAt: number, type: string, pluginId: string, resourceId: string): GlobalActivityEntry => ({
  type,
  pluginId,
  resourceId,
  createdAt,
});

const createDummyActivityEntry = (createdAt: number, type: string, pluginId: string, resourceId: string): ActivityEntry => ({
  type,
  resourceId,
  createdAt,
});

const dbEntries: GlobalActivityEntry[] = [
  createDummyGlobalActivityEntry(50, 'c', 'c2', 'r1'),
  createDummyGlobalActivityEntry(100, 'c', 'c2', 'r3'),
  createDummyGlobalActivityEntry(200, 'b', 'c1', 'r3'),
  createDummyGlobalActivityEntry(300, 'a', 'c1', 'r3'),
  createDummyGlobalActivityEntry(400, 'c', 'c2', 'r2'),
  createDummyGlobalActivityEntry(500, 'a', 'c1', 'r3'),
];

const globalActivity$: Observable<GlobalActivityEntry> = from([
  createDummyGlobalActivityEntry(1000, 'a', 'c1', 'r2'),
  createDummyGlobalActivityEntry(2000, 'b', 'c2', 'r2'),
  createDummyGlobalActivityEntry(3000, 'a', 'c1', 'r1'),
  createDummyGlobalActivityEntry(4000, 'c', 'c2', 'r1'),
  createDummyGlobalActivityEntry(5000, 'b', 'c1', 'r1'),
]);

describe('sdk:activity:createActivityObservable', () => {
  describe('ascending sort by createdAt', () => {

    test('order and limit', (done) => {
      const options: Options = {
        pluginId: '',
        queryArgs: { orderBy: 'createdAt', ascending: true, limit: 2, where: { types: null }, whereNot: {}, global: true },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
              createDummyActivityEntry(100, 'c', 'c2', 'r3'),
            ],
          ]);
          done();
        }
      );
    });

    test('filter by resource', (done) => {
      const options: Options = {
        pluginId: '',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: true,
          limit: 2,
          where: { resourceIds: 'r1', types: null },
          whereNot: {},
          global: true,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
            ],
            [
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
            ],
          ]);
          done();
        }
      );
    });

    test('filter by consumer', (done) => {
      const options: Options = {
        pluginId: 'c1',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: true,
          limit: 2,
          where: { resourceIds: null, types: null },
          whereNot: { },
          global: false,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(200, 'b', 'c1', 'r3'),
              createDummyActivityEntry(300, 'a', 'c1', 'r3'),
            ],
          ]);
          done();
        }
      );
    });

    test('filter by type', (done) => {
      const options: Options = {
        pluginId: '',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: true,
          limit: 2,
          where: { resourceIds: null, types: 'b' },
          whereNot: { },
          global: true,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(200, 'b', 'c1', 'r3'),
            ],
            [
              createDummyActivityEntry(200, 'b', 'c1', 'r3'),
              createDummyActivityEntry(2000, 'b', 'c2', 'r2'),
            ],
          ]);
          done();
        }
      );
    });

    test('mixed filters', (done) => {
      const options: Options = {
        pluginId: 'c2',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: true,
          limit: 2,
          where: { resourceIds: 'r1', types: 'c' },
          whereNot: { },
          global: true,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
            ],
            [
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
              createDummyActivityEntry(4000, 'c', 'c2', 'r1'),
            ],
          ]);
          done();
        }
      );
    });

    test('when no results', (done) => {
      const options: Options = {
        pluginId: 'unknown',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: true,
          limit: 2,
          where: { resourceIds: null, types: null },
          whereNot: { },
          global: false,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([[]]);
          done();
        }
      );
    });
  });

  describe('descending sort by createdAt', () => {

    test('order and limit', (done) => {
      const options: Options = {
        pluginId: '',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: false,
          limit: 2,
          where: { resourceIds: null, types: null },
          whereNot: { },
          global: true,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(500, 'a', 'c1', 'r3'),
              createDummyActivityEntry(400, 'c', 'c2', 'r2'),
            ],
            [
              createDummyActivityEntry(1000, 'a', 'c1', 'r2'),
              createDummyActivityEntry(500, 'a', 'c1', 'r3'),
            ],
            [
              createDummyActivityEntry(2000, 'b', 'c2', 'r2'),
              createDummyActivityEntry(1000, 'a', 'c1', 'r2'),
            ],
            [
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
              createDummyActivityEntry(2000, 'b', 'c2', 'r2'),
            ],
            [
              createDummyActivityEntry(4000, 'c', 'c2', 'r1'),
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
            ],
            [
              createDummyActivityEntry(5000, 'b', 'c1', 'r1'),
              createDummyActivityEntry(4000, 'c', 'c2', 'r1'),
            ],
          ]);
          done();
        }
      );
    });

    test('filter by resource', (done) => {
      const options: Options = {
        pluginId: '',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: false,
          limit: 2,
          where: { resourceIds: 'r1', types: null },
          whereNot: { },
          global: true,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
            ],
            [
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
            ],
            [
              createDummyActivityEntry(4000, 'c', 'c2', 'r1'),
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
            ],
            [
              createDummyActivityEntry(5000, 'b', 'c1', 'r1'),
              createDummyActivityEntry(4000, 'c', 'c2', 'r1'),
            ],
          ]);
          done();
        }
      );
    });

    test('filter by consumer', (done) => {
      const options: Options = {
        pluginId: 'c1',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: false,
          limit: 2,
          where: { resourceIds: null, types: null },
          whereNot: { },
          global: false,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(500, 'a', 'c1', 'r3'),
              createDummyActivityEntry(300, 'a', 'c1', 'r3'),
            ],
            [
              createDummyActivityEntry(1000, 'a', 'c1', 'r2'),
              createDummyActivityEntry(500, 'a', 'c1', 'r3'),
            ],
            [
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
              createDummyActivityEntry(1000, 'a', 'c1', 'r2'),
            ],
            [
              createDummyActivityEntry(5000, 'b', 'c1', 'r1'),
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
            ],
          ]);
          done();
        }
      );
    });

    test('filter by type', (done) => {
      const options: Options = {
        pluginId: '',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: false,
          limit: 2,
          whereNot: { },
          where: { resourceIds: null, types: 'a' },
          global: true,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(500, 'a', 'c1', 'r3'),
              createDummyActivityEntry(300, 'a', 'c1', 'r3'),
            ],
            [
              createDummyActivityEntry(1000, 'a', 'c1', 'r2'),
              createDummyActivityEntry(500, 'a', 'c1', 'r3'),
            ],
            [
              createDummyActivityEntry(3000, 'a', 'c1', 'r1'),
              createDummyActivityEntry(1000, 'a', 'c1', 'r2'),
            ],
          ]);
          done();
        }
      );
    });

    test('mixed filters', (done) => {
      const options: Options = {
        pluginId: 'c2',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: false,
          limit: 2,
          whereNot: { },
          where: { resourceIds: 'r1', types: 'c' },
          global: true,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
            ],
            [
              createDummyActivityEntry(4000, 'c', 'c2', 'r1'),
              createDummyActivityEntry(50, 'c', 'c2', 'r1'),
            ],
          ]);
          done();
        }
      );
    });

    test('when no results', (done) => {
      const options: Options = {
        pluginId: 'unknown',
        queryArgs: {
          orderBy: 'createdAt',
          ascending: false,
          limit: 2,
          where: { resourceIds: null, types: null },
          whereNot: {},
          global: false,
        },
      };
      const activityObservable = createActivityObservable(options, dbEntries, globalActivity$);

      const allEntries: ActivityEntry[][] = [];

      activityObservable.subscribe(
        entries => allEntries.push(entries),
        () => { },
        () => {
          expect(allEntries).toEqual([
            [],
          ]);
          done();
        }
      );
    });
  });
});
