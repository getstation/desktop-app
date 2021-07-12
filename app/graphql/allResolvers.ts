import { addResolveFunctionsToSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { Resolvers } from './resolvers-types.generated';

import appResolvers from '../app/resolvers';
import autoUpdateResolvers from '../auto-update/resolvers';
import applicationsResolvers from '../applications/resolvers';
import abstractApplicationsResolvers from '../abstract-application/resolvers';
import activityResolvers from '../activity/resolvers';
import tabWebContentResolvers from '../tab-webcontents/resolvers';
import tabsResolvers from '../tabs/resolvers';
import resourcesResolvers from '../resources/worker/resolvers';
import favoriteResolver from '../favorites/resolvers';
import onboardingResolver from '../onboarding/resolvers';

// Classic `addResolveFunctionsToSchema` does not support reactive resolvers
// (resolvers that returns Observable) whereas it's definitely fine.
// Let's override its declaration to make make typing happy
declare module 'graphql-tools' {
  interface IAddResolveFunctionsToSchemaOptions {
    schema: GraphQLSchema;
    resolvers: Resolvers;
    // not complete
  }
  function addResolveFunctionsToSchema(
    options: IAddResolveFunctionsToSchemaOptions | GraphQLSchema,
  ): GraphQLSchema;
}

/**
 * Import and add Station resolvers to the schema.
 */
export function addAllResolvers(schema: GraphQLSchema) {
  addResolveFunctionsToSchema({ schema, resolvers: appResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: autoUpdateResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: applicationsResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: abstractApplicationsResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: activityResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: tabWebContentResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: tabsResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: resourcesResolvers });
  addResolveFunctionsToSchema({ schema, resolvers: favoriteResolver });
  addResolveFunctionsToSchema({ schema, resolvers: onboardingResolver });
}
