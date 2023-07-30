import gql from 'graphql-tag';

export const GET_CUSTOM_APP_REQUEST_MODE = gql`
    query {
        appRequestMode @client {
            appRequestIsOpen
            currentMode
        }
    }
`;

export const SET_CUSTOM_APP_REQUEST_MODE = gql`
    mutation SetCustomAppRequestMode(
        $appRequestIsOpen: Boolean!
        $currentMode: String!
    ) {
        setCustomAppRequestMode(
            appRequestIsOpen: $appRequestIsOpen
            currentMode: $currentMode
        ) @client {
            appRequestIsOpen
            currentMode
        }
    }
`;
