import { Resolvers } from '../../graphql/resolvers-types.generated';
import { getBxResourceForBxResourceId } from '../utils';

const resolvers: Resolvers = {
  Query: {
    getBxResource: async (_, { bxResourceId }, { resourceRouter }) =>
      getBxResourceForBxResourceId(resourceRouter, bxResourceId),
  },
  Mutation: {
    navigateBxResource: async (_obj, { bxResourceId }, context) => {
      await context.resourceRouter.open(bxResourceId);
      return true;
    },
  },
};

export default resolvers;
