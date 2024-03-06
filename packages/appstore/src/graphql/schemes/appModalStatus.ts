import gql from 'graphql-tag';

export const GET_APP_MODAL_STATUS = gql`
    query {
        appModalStatus @client {
            isAppModalOpen
        }
    }
`;

export const SET_APP_MODAL_STATUS = gql`
    mutation SetAppModalStatus($isAppModalOpen: Boolean!) {
        setAppModalStatus(isAppModalOpen: $isAppModalOpen) @client {
            isAppModalOpen
        }
    }
`;
