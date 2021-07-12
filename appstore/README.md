# appstore

Station Application Store.

> Based on https://github.com/piotrwitek/react-redux-typescript-webpack-starter

## Getting Started
> project optimized to use yarn

```
git clone git@github.com:getstation/appstore.git
cd appstore
yarn install
```

Before starting the project, you need to serve the Station API. Check https://github.com/getstation/api and run it in the background.

Then:

```
// Run development server with react hot-reload
yarn dev (ts-loader)
or
yarn dev2 (awesome-typescript-loader)
```

### Local App Store on Station Dev

To use the local App Store inside a local dev instance of Station, you have to change the App Store tab URL:

- Start a local instance of the App Store (should run on `http://localhost:8080`)
- Start Station Dev and open the App Store (should open `https://apps.getstation.com`)
- Open the page Javascript console (`View > Developer > Open Page Developer Tools`)
- Run `window.location = 'http://localhost:8080'`
- Verify that it points to your local App Store (`Edit > Copy Current Page's URL`)

You can also open the Station Dev's database, go to the `tab` table and change the `appstore` URL (see https://github.com/getstation/browserX/blob/master/README.md#inspect-db).

## GraphQL code generation
documentation: https://graphql-code-generator.com/docs/getting-started/

used preset: https://graphql-code-generator.com/docs/presets/near-operation-file

used plugins: 
  - [typescript](https://graphql-code-generator.com/docs/plugins/typescript)
  - [typescript-operations](https://graphql-code-generator.com/docs/plugins/typescript-operations)
  - [typescript-react-apollo](https://graphql-code-generator.com/docs/plugins/typescript-react-apollo)

GraphQL Code Generator is able to work with more than one schema, it will perform a merge on given schemas.

Ref: [Multiple schemas and client-side schema](https://graphql-code-generator.com/docs/getting-started/schema-field#multiple-schemas-and-client-side-schema)

In our case, we merge both `api-schema.graphqls` and `client-schema.graphqls` types


#### Usage

- You can write queries and mutations in any `.gql` file, please note we prefer to put the `.gql` file at the same level of the concerned component if possible
- then, use `yarn gql-gen`
- For each `.gql` file, a `.gql.generated.ts` file is generated with react HOC and hooks utils
- For local graphql, just use the `@client` directive
- Finally, in your component, import the `.gql.generated` file to get utils
  - _hooks are used with React functional components_
  - _HOC are used with React class components_

Example usage (server api with hoc): `src/HOC/withAllCategories.ts`

Example usage (client api with hooks): `src/components/AppStoreAside/AppStoreAsideNav/AppStoreAsideNavButton/customHooks.ts`


#### Client
- The main schema definition is `client-schema.graphqls`
- Generated types are merged with server schema in `src/types.generated.ts`

#### Server
- The main schema definition is `api-schema.graphqls`
- Generated types are merged with client schema in `src/types.generated.ts`

You can update the `api-schema.graphqls` file version with:
  - from the production API: `npx get-graphql-schema https://api.getstation.com/graphql > api-schema.graphqls`
  - from the local dev API: `npx get-graphql-schema http://localhost:4001/graphql > api-schema.graphqls`

### React Hooks
During the development of new components, we strongly encourage the use of react hooks:
- Hooks Introduction: https://reactjs.org/docs/hooks-intro.html
- Hooks FAQ: https://reactjs.org/docs/hooks-faq.html
- Hooks API Reference: https://reactjs.org/docs/hooks-reference.html

You can find an example of hooks in `AppStoreAsideNavButton` component.


## CLI Commands

### Development

`yarn dev` - start dev-server with hot-reload (ts-loader)

### Type checking

`yarn tsc` - entire project type-check

`yarn tsc:watch` - fast incremental type-checking in watch mode

### codegen

`yarn gql-gen` - generate TypeScript typings from .gql files and schemas

### Production Bundling (`dist/` folder)

`yarn clean` - clean dist

`yarn build` - build dist bundle in `dist/`

### Utility & Git Hooks

`yarn reinstall` - reinstall all dependencies (useful when switching branch) (note: use `reinstall:win` on Windows)

`yarn lint` - run linter (tslint)

`yarn test` - run tests with jest runner

`yarn test:update` - update jest snapshots

`yarn precommit` - pre commit git hook - linter

`yarn prepush` - pre push git hook - linter, tests and check types

### Storybook

`yarn storybook` - run storybook with webpack-dev-server`

`yarn build:storybook` - build storybook static files in `dist/__storybook`

When deployed, you can acess storybook on https://apps.getstation.com/__storybook

## Deployment

`master` branch is deployed with Netlify
[![Netlify Status](https://api.netlify.com/api/v1/badges/2e9e9375-9c3d-4e3e-be7f-94d7b7059bf8/deploy-status)](https://app.netlify.com/sites/station-appstore/deploys)
