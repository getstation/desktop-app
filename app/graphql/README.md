# Usage
_How to connect a React component to its source of data using local GraphQL server?_

## Checklist

1. Modify GraphQL local schema in `app/graphql/schema.graphql`
2. Frontend:
    1. Create a `queries@local.gql` in component folder
    2. Write necessary queries in `queries@local.gql`
    3. Register your documents in codegen config (`codegen-local.yml`)
    4. Run `yarn run gql-gen` to generate `queries@local.gql.generated.tsx`
    5. Use the components of `queries@local.gql.generated.tsx` in the React component to connect data
3. Backend:
    1. Run `yarn run gql-gen` to update `app/graphql/resolvers-types.generated.ts`
    2. Create a `resolvers.ts` next to code for the source of data
    3. Write necessary resolvers in `resolvers.ts` and use `resolvers-types.generated.ts` for typing
    4. Add the new resolvers in `app/graphql/allResolvers.ts`

## By example

Let's say we have a React component `DummyStatus` and we want to connect the value of `working`.

```tsx
// in app/dummy/DummyStatus.tsx
export interface Props {
  working: boolean
}
export default class DummyStatus extends React.PureComponent<Props, {}> {
  render() {
    // we want to connect the `working` prop to its source of data
    const { working } = this.props;
    return (
      <p>I'm {working ? 'working' : 'not working'}</p>
    );
  }
}
```

### Schema

Modify the GraphQL local schema in `app/graphql/schema.graphql`:

```diff
   type Query {
     """Is launch at startup enabled or not."""
     autoLaunchEnabled: Boolean
+
+    """Return true if dummy is working"""
+    isDummyWorking: Boolean!
   }
```

_Note: if you are adding a big chunk of schema, consider using [schema import](#schema-import)_
_Note: see also [Apollo: understanding schema concepts]_

### On the front-end

Create a `app/dummy/queries@local.gql` that'll hold the necessay queries:

```graphql
query GetDummyStatus @live @local {
  isDummyWorking
}
```
_Note: see also [GraphQL: learn queries]_

Register your queries in codegen config `codegen-local.yml` to generate a query components in `app/dummy/queries@local.gql.generated.tsx`:
```diff
+  ./app/dummy/queries@local.gql.generated.tsx:
+    documents: ./app/dummy/queries@local.gql
+    plugins:
+      - typescript
+      - typescript-operations
+      - typescript-react-apollo
```

Run the generator: `$ yarn run gql-gen`.

Connect the React component with the generated providers:
```diff
+import { GetDummyStatus } from './queries@local.gql.generated';
...
-export default class DummyStatus extends React.PureComponent<Props, {}> {
+class DummyStatus extends React.PureComponent<Props, {}> {
  ...
}
+const withWorkingState = withGetDummyStatus({
+  props: ({ data }) => ({
+    // map data to props
+    working: data && Boolean(data.isDummyWorking),
+  }),
+});
+
+export default withWorkingState(DummyStatus);
```
_Note: look at [Apollo's "using typescript"] for more tips_

### On the back-end
Run `yarn run gql-gen` to update the resolvers`app/graphql/resolvers-types.generated.ts`

Create a `app/dummy-data/resolvers.ts`:
```ts
import { IResolvers } from '../graphql/resolvers-types.generated';

const resolvers: IResolvers = {
  Query: {
    isDummyWorking: (obj, args, context) => {
      return true;
    },
  },
};

export default resolvers;
```

Add the new resolvers in `app/graphql/allResolvers.ts`:

```diff
+import dummyResolvers from '../dummy-data/resolvers';

 /**
@@ -8,4 +9,6 @@ import { GraphQLSchema } from 'graphql';
 export function addAllResolvers(schema: GraphQLSchema) {
+  addResolveFunctionsToSchema({ schema, resolvers: dummyResolvers });
 }
```

# Recipes

## Schema import

You can declare a schema in a separate file and import it in the main schema file.

Modify the GraphQL local schema in `app/graphql/schema.graphql`:

```diff
+# import Query.*, Mutation.* from "../dummy/schema.graphql"
+
   type Query {
     """Is launch at startup enabled or not."""
     autoLaunchEnabled: Boolean
```

and in `app/dummy/schema.graphql`:

```gql
  type Query {
    """Return true if dummy is working"""
    isDummyWorking: Boolean!
  }
```

_see [graphql-import](https://github.com/prisma/graphql-import)_


## Reactive resolvers
Resolvers can return a value, a Promise, but also a RxJS's Observable. In this case, the data on the front-end will be automatically updated with the observable value.

```ts
import { timer } from "rxjs";

const resolvers = {
  Query: {
    // resolvers can return an Observable
    time: () => {
      // Observable that emits increasing numbers every 1 second
      return timer(1000, 1000);
    }
  }
};
```
_Note: see [reactive-graphql](https://github.com/mesosphere/reactive-graphql/)_

## Use redux-store in resolvers
GraphQL resovers' context have a reference to the redux store. You can use `subscribeStore` to resolve an observable which value corresponds to the given state's selector and that will be updated on change.

```ts
import { subscribeStore } from '../utils/observable';
import { getAppAutoLaunchEnabledStatus } from './selectors';

const resolvers: IResolvers = {
  Query: {
    autoLaunchEnabled: (_obj, _args, context) => {
      return subscribeStore(context.store, getAppAutoLaunchEnabledStatus);
    },
  },
}
```

## Typing will guide you

The typing of the generated provider components and resolvers is infered from GraphQL schema and queries. Use this to help development!

_Note: see also [Apollo's "using typescript"]_

## Use Apollo dev tool
Use [Apollo Client Devtools](https://github.com/apollographql/apollo-client-devtools) to inspect queries and the schema.

_In Bx, you sometimes need to close and reopen the devtool to see the Apollo tab appear._

## Mocking and Storybook

We use [apollo-storybook-decorator](https://github.com/abhiaiyer91/apollo-storybook-decorator) to connect Apollo to Storybook.
This decorator uses the schema (`app/graphql/schema.graphql`) and mocks resolvers automatically.
Everything is already set up in the `.storybook/config` file and the stories don't need anything special.

1. Create a `stories.tsx` file in the component folder
2. Write the stories you need:

```tsx
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import MyComponent from './MyComponent';

storiesOf('Component|MyComponent ', module)
  .add('My Component - Normal', () => {
    return (
      <MyComponent />
    );
  });
```

_See also [Apollo Mocking](https://www.apollographql.com/docs/graphql-tools/mocking.html)_

If you want custom mocking, you need to pass it in the decorator `mock` options in Storybook config.

## Multiple queries (and mutations) in `documents`
You can gather the different queries and mutations necessary for a feature or a component in a single `queries@local.gql` file. The generator will generate several components.

## Working with the remote API
To query the the API `api.getstation.com`, in your queries, omit the `@local` directive in your query.

You can use the code-generation as well. That's the same principle as described above, except:
- make sure the API schema is up to date:
  -- to update from the production API: `npx get-graphql-schema https://api.getstation.com/graphql > api-schema.graphqls`
  -- to update from the local dev API: `npx get-graphql-schema http://localhost:4001/graphql > api-schema.graphqls`
- you'll need to reference to your documents in the `codegen.yaml` and not `codegen-local.yaml`
- the convention is `queries.gql` and not `queries@local.gql`

## HOC composition
Compose several queries and mutaiton before connecting to the react component.

Example:
```tsx
import * as React from 'react';
import { compose } from 'redux';
import { GetAutolaunchStatus, EnableAutoLaunch } from './queries@local.gql.generated';

class SettingsAutoLaunch extends React.Component<Props, {}> {
  ....
}

const connect = compose(
  withGetAutolaunchStatus<{}, Partial<Props>>({
    props: ({ data }) => ({
      loading: !data || data.loading,
      isAutoLaunchEnabled: !!data && Boolean(data.autoLaunchEnabled),
    }),
  }),
  withEnableAutoLaunch<{}, Partial<Props>>({
    props: ({ mutate }) => ({
      onEnableAutoLaunch: (enabled: boolean) => mutate && mutate({ variables: { enabled } }),
    }),
  })
);

export default connect(SettingsAutoLaunch);
```

# Known caveats
- Can't use [fragments](https://www.apollographql.com/docs/react/advanced/fragments.html)
- Make sure to use `@live` (and `@local`) directives, otherwise the results will not be updated

# Developers

## Motivation
_Being able to make faster iteration on the UI of Station._

This motivation led to these requirements:
- Decouple data logic from UI logic (back-end vs front-end)
- Have a clear and well-defined interface between data and UI
- Being able to mock data logic to work on UI part only
- Being able to dev UI outside app (a la storybook)
- Get closer to web dev standard stack to use eco-system and community experience
- (Almost) perfect typing without much effort

## Architecture overview
A large part of the stack use classic GraphQL tools and architecture of a schema being executed locally.

### "Exostisms"
The few "exostisms" lies in:
- *reactive resolvers*: as noted above, we can use reactive resolvers. This is possible because queries are executed against a particular GraphQL implementation that supports reactive resolvers ([reactive-graphql](https://github.com/mesosphere/reactive-graphql/)). In future, we hope this will be stadardized in GraphQL standard implementation.
- *directive-based routing*: we have 2 query executors: local resolvers and the remote API. The queries are routed one or the other using the directive `@local` on the query. This is implemented thanks to Apollo links. See `splitLocalAndAPI`. In the future, we'd prefer using schema stitching.
- *transfer queries from renderer to main*: the client is on the renderer side while the query execution runs on the main-side.

### Tech stack
- [reactive-graphql](https://github.com/mesosphere/reactive-graphql/): GraphQL reactive executor (observable resolver).
- [apollo-link-reactive-schema](https://github.com/getstation/apollo-link-reactive-schema): Apollo Link that provides a reactive-graphql execution environment to perform operations on a provided reactive schema.
- [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator): used to generate resolvers typings and provider components.
- [graphql-codegen-typescript-reactive-resolvers](https://github.com/getstation/graphql-codegen-typescript-reactive-resolvers): plugin for graphql-code-generator that supports reactive resolvers.
- [react-apollo](https://github.com/apollographql/react-apollo): GraphQL client for React.
- [apollo-storybook-decorator](https://github.com/abhiaiyer91/apollo-storybook-decorator): use storybook with GraphQL (does the mocking).
- [Apollo Links](https://github.com/apollographql/apollo-link) and friends: to do some piping.
- [graphql-import]: to cut schema in different files

[Apollo: understanding schema concepts]: https://www.apollographql.com/docs/apollo-server/essentials/schema.html
[GraphQL: learn queries]: https://graphql.org/learn/queries/
[Apollo's "using typescript"]: https://www.apollographql.com/docs/react/recipes/static-typing.html
[graphql-import]: https://github.com/prisma/graphql-import
