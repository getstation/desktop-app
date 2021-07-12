import gql from 'graphql-tag';

export const GET_ACTIVE_SCREEN_NAME = gql`
  query {
    activeScreenName @client {
      value
    }
  }
`;

export const SET_ACTIVE_SCREEN_NAME = gql`
  mutation SetActiveScreenName($activeScreenName: String!) {
    setActiveScreenName(activeScreenName: $activeScreenName) @client {
      activeScreenName
    }
  }
`;
