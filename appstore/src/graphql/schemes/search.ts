import gql from 'graphql-tag';

export const GET_SEARCH_STRING = gql`
    {
        search @client {
            searchString
            searchStringAfterEnterPress 
            isEnterPressed
        }
    }
`;

export const SET_SEARCH_STRING = gql`
    mutation SetSearchString($searchString: String!, $searchStringAfterEnterPress: String, $isEnterPressed: Boolean) {
        setSearchString(
            searchString: $searchString,
            searchStringAfterEnterPress: $searchStringAfterEnterPress,
            isEnterPressed: $isEnterPressed
        ) @client {
            search {
                searchString
                searchStringAfterEnterPress
                isEnterPressed
            }
        }
    }
`;
