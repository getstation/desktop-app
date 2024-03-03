import gql from 'graphql-tag';

export const UPDATE_APPLICATION_FROM_RECIPE = gql`
  mutation UpdateApplicationFromRecipe(
    $applicationId: ID!
    $applicationRecipe: UpdateApplicationRecipeInput!
  ) {
    updateApplicationFromRecipe(
      applicationId: $applicationId,
      applicationRecipe: $applicationRecipe
    ) {
      id
      name
      category {
        name
      }
      bxAppManifestURL
      themeColor
      iconURL
      startURL
      isChromeExtension
    }
  }
`;
