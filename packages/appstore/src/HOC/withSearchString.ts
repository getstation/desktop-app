import { graphql } from 'react-apollo';

import { GET_SEARCH_STRING } from '../graphql/schemes/search';

export type GetSearchStringResponse = {
  search: {
    searchString: string,
    searchStringAfterEnterPress: string,
    isEnterPressed: boolean,
  },
};

export type WithSearchStringProps = {
  searchString?: string,
  searchStringAfterEnterPress?: string,
  isEnterPressed?: boolean,
};

export default graphql<{}, GetSearchStringResponse, {}, WithSearchStringProps>(GET_SEARCH_STRING, {
  props: ({ data }) => ({
    searchString: data!.search!.searchString,
    searchValue: data!.search!.searchString,
    searchStringAfterEnterPress: data!.search!.searchStringAfterEnterPress,
    isEnterPressed: data!.search!.isEnterPressed,
  }),
});
