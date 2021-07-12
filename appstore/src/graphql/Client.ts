import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import initialClientState from '@src/graphql/initialClientState';
import { typeDefs } from '@src/graphql/typeDefs';

import resolvers from './resolvers/index';

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  typeDefs,
  resolvers,
});

cache.writeData({ data: initialClientState });

export default client;
