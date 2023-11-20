import { ReactiveSchemaLink } from '@getstation/apollo-link-reactive-schema';
import { concat } from 'apollo-link';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from 'graphql-tools';
import { IManifestProvider } from '../applications/manifest-provider/types';
import ResourceRouterDispatcher from '../resources/ResourceRouterDispatcher';
import { StationStoreWorker } from '../types';
import { addAllResolvers } from './allResolvers';
import { DistinctConsecutiveResultsLink } from './distinctConsecutiveResultsLink';

const typeDefs = require('./schema.graphql');

export type StationGQLContext = {
  store: StationStoreWorker,
  manifestProvider: IManifestProvider,
  resourceRouter: ResourceRouterDispatcher,
  pubsub: PubSub,
};

const schema = makeExecutableSchema<StationGQLContext>({ typeDefs });
addAllResolvers(schema);

/**
 * Returns a ApolloLink that will dispatch GQL operations between the local
 * reactive schema and the remote API based on directive `@local`
 */
export const getLink = (contextFn: () => StationGQLContext) => {
  return concat(
    new DistinctConsecutiveResultsLink(),
    new ReactiveSchemaLink<StationGQLContext>({
      schema,
      context: contextFn,
    })
  );
};
