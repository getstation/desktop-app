import gql from 'graphql-tag';

export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($applicationId: ID!) {
    deleteApplication(applicationId: $applicationId)
  }
`;
