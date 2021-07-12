import { SearchLocalState } from '@src/graphql/initialClientState';

export interface SetSearchStringVariables {
  searchString: string,
  searchStringAfterEnterPress?: string,
  isEnterPressed?: boolean,
}

export default (_: any, { searchString, searchStringAfterEnterPress, isEnterPressed }: SetSearchStringVariables, { cache }: any) => {
  const newSearchData: SearchLocalState = {
    searchString,
    searchStringAfterEnterPress,
    isEnterPressed,
    __typename: 'SearchString',
  };
  const data = { search: newSearchData };
  cache.writeData({ data });
  return cache.data.search;
};
