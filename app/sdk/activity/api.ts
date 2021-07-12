import { activity } from '@getstation/sdk';
import { evolve, omit, pipe } from 'ramda';
import { compact } from 'ramda-adjunct';
import { AnyFindOptions, Op } from 'sequelize';
import { GlobalActivityEntry, SerializedActivityEntry } from './types';

export const deserializeActivityEntry: (activity: SerializedActivityEntry) => GlobalActivityEntry = pipe(
  omit(['id']),
  evolve({
    extraData: (data: string) => Boolean(data) ? JSON.parse(data) : undefined,
  })
);

export const getSerializedQueryParams = (consumer: activity.ActivityConsumer, queryArgs: activity.QueryArgs):
  AnyFindOptions => {
  const { global, orderBy, ascending, where, whereNot, limitByDate } = queryArgs;

  const whereResources = where.resourceIds ? { resourceId: where.resourceIds } : {};
  const whereManifestURLs = where.manifestURLs ? { manifestURL: where.manifestURLs } : {};
  const whereTypes = where.types ? { type: where.types } : {};

  const whereNotResources = whereNot.resourceIds ? { resourceId: whereNot.resourceIds } : null;
  const whereNotManifestURLs = whereNot.manifestURLs ? { manifestURL: whereNot.manifestURLs } : null;
  const whereNotTypes = whereNot.types ? { type: whereNot.types } : null;
  const whereNotQuery = compact([whereNotResources, whereNotManifestURLs, whereNotTypes]).length === 0 ?
    {} :
  {
    [Op.not]: [
      whereNotManifestURLs,
      whereNotResources,
      whereNotTypes,
    ],
  };

  const wherePlugin = Boolean(global) ? {} : { pluginId: consumer.id };
  const whereDate = limitByDate ? {
    createdAt: {
      [Op.gte]: limitByDate,
    },
  } : {};

  return {
    order: [
      [orderBy, ascending ? 'ASC' : 'DESC'],
    ],
    where: {
      ...whereManifestURLs,
      ...whereResources,
      ...whereTypes,
      ...wherePlugin,
      ...whereNotQuery,
      ...whereDate,
    },
  };
};
