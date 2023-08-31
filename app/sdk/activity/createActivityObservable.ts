import { activity } from '@getstation/sdk';
import {
  complement, compose, dissoc, findIndex, findLastIndex, identity, inc,
  insert, is, pipe, propEq, take, flatten, filter, map,
} from 'ramda';
import * as operators from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Reducer, Transformer } from '../../utils/fp';
import { GlobalActivityEntry } from './types';
import ActivityEntry = activity.ActivityEntry;
import QueryArgs = activity.QueryArgs;

export type Options = { queryArgs: QueryArgs, pluginId: string };

type GlobalActivityFilter = Transformer<GlobalActivityEntry[]>;
type ActivityEntryConverter = Transformer<GlobalActivityEntry[], ActivityEntry[]>;

const convertGlobalActivity: ActivityEntryConverter =
  map<GlobalActivityEntry, ActivityEntry>(dissoc('pluginId'));

const createActivityFilter = (options: Options): GlobalActivityFilter => {
  const { queryArgs: { global, where, whereNot }, pluginId } = options;

  const filterByConsumer: GlobalActivityFilter = Boolean(global)
    ? identity
    : filter(propEq('pluginId', pluginId));

  const filterWhereResource: GlobalActivityFilter = !where.resourceIds
    ? identity
    : is(Array, where.resourceIds) ?
      filter(e => where.resourceIds!.includes(e.resourceId)) :
      filter(propEq('resourceId', where.resourceIds));

  const filterWhereManifest: GlobalActivityFilter = !where.manifestURLs
    ? identity
    : is(Array, where.manifestURLs) ?
      filter(e => where.manifestURLs!.includes(e.manifestURL!)) :
      filter(propEq('manifestURL', where.manifestURLs));

  const filterWhereType: GlobalActivityFilter = !where.types
    ? identity
    : is(Array, where.types) ?
      filter(e => where.types!.includes(e.type)) :
      filter(propEq('type', where.types));

  const filterWhereNotResource: GlobalActivityFilter = !whereNot.resourceIds
    ? identity
    : is(Array, whereNot.resourceIds) ?
      filter(e => !whereNot.resourceIds!.includes(e.resourceId)) :
      filter(complement(propEq('resourceId', whereNot.resourceIds)));

  const filterWhereNotManifest: GlobalActivityFilter = !whereNot.manifestURLs
    ? identity
    : is(Array, whereNot.manifestURLs) ?
      filter(e => !whereNot.manifestURLs!.includes(e.manifestURL!)) :
      filter(complement(propEq('manifestURL', whereNot.manifestURLs)));

  const filterWhereNotType: GlobalActivityFilter = !whereNot.types
    ? identity
    : is(Array, whereNot.types) ?
      filter(e => !whereNot.types!.includes(e.type)) :
      filter(complement(propEq('type', whereNot.types)));

  return pipe(
    filterByConsumer,
    filterWhereManifest,
    filterWhereResource,
    filterWhereType,
    filterWhereNotManifest,
    filterWhereNotResource,
    filterWhereNotType,
  );
};

const createGetBiggerValueIndex = <T extends Record<K, number>, K extends keyof T>(
  entry: any,
  sortKey: K,
  ascending: boolean,
): Transformer<T[], number> => {
  const indexFinder = ascending ? findIndex : findLastIndex;
  const indexAdjuster: Transformer<number> = ascending ? identity : inc; // we need to increment the index in case of descending sort
  return compose(indexAdjuster, indexFinder((e: T) => (
    e[sortKey] > entry[sortKey]
  )));
};

const orderAndLimit = <T extends Record<K, number>, K extends keyof T>(
  sortKey: K,
  ascending: boolean = true,
  limit: number,
): Reducer<T[], T[]> => {
  return (sortedEntries, newEntries) => {
    return flatten(newEntries.map(newEntry => {
      const getBiggerValueIndex = createGetBiggerValueIndex<T, K>(newEntry, sortKey, ascending);
      const index = getBiggerValueIndex(sortedEntries); // negative index means need to be push back
      const nextEntries = insert(index, newEntry, sortedEntries);

      if (nextEntries.length <= limit) {
        return nextEntries;
      }

      return take(limit, nextEntries);
    }));
  };
};

const createActivityObservable = (
  options: Options,
  dbResults: GlobalActivityEntry[],
  globalActivity$: Observable<GlobalActivityEntry>,
): Observable<ActivityEntry[]> => {
  const { queryArgs }: Options = options;
  const activityFilter = createActivityFilter(options);

  const limit = Math.max(0, queryArgs.limit);
  const activityReducer = orderAndLimit<GlobalActivityEntry, 'createdAt'>(queryArgs.orderBy, queryArgs.ascending, limit);
  const filteredDbResults = activityFilter(dbResults).map(r => [r]).reduce(activityReducer, []);

  const limitedDbResults = take(limit, filteredDbResults);
  const nbMissingEntries = Math.max(0, limit - limitedDbResults.length);

  const globalAscendingLimitor = queryArgs.ascending ? operators.take(nbMissingEntries) : identity;
  const limitedGlobalActivity$ = globalActivity$
    .pipe(
      operators.map(entry => [entry]),
      operators.map(activityFilter),
      operators.filter(activities => activities.length > 0)
    )
    .pipe(globalAscendingLimitor);

  return of(limitedDbResults)
    .pipe(
      operators.concat(limitedGlobalActivity$), // all filtered results (history results + activity results)
      operators.map(pipe(
        activityFilter,
        convertGlobalActivity,
      )),
      operators.scan(activityReducer, []), // ordering and limit
      operators.distinctUntilChanged()
    );
};

export default createActivityObservable;
