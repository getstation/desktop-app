import gql from 'graphql-tag';

export const typeDefs = gql`

  type SelectedCustomApp {
    app: Application!
  }

  type AppModalStatus {
    isAppModalOpen: Boolean!
  }

  input CustomAppInput {
    "An URL do the BxApp manifest of this application"
    bxAppManifestURL: String!
    "The category of the application"
    category: ApplicationCategoryInput
    "An URL to icon represenrting the app"
    iconURL: String
    id: ID!
    "true if this application is a chrome extension"
    isChromeExtension: Boolean
    "Manifest"
    name: String!
    "The id of the BrowserX service in the previous architecture"
    previousServiceId: String
    "If the app is recommanded, the position in the list of recommanded apps"
    themeColor: String
    startURL: String
  }

  input ApplicationCategoryInput {
    name: String!
  }

  extend type Query {
    selectedCustomApp: SelectedCustomApp
    appModalStatus: AppModalStatus
  }

  extend type Mutation {
    setSelectedCustomApp (
      app: CustomAppInput!
    ): SelectedCustomApp
    setAppModalStatus (isAppModalOpen: Boolean!): AppModalStatus
  }
`;
