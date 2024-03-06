import { MutationFn } from 'react-apollo';

export type MutationData = {
  data: {
    setSearchString: {
      searchString: string,
      searchStringAfterEnterPress?: string,
      isEnterPressed?: boolean,
    },
  },
};

type MutationVariables = {
  searchString: string,
  searchStringAfterEnterPress?: string,
  isEnterPressed?: boolean,
};

export type MutateSetSearchStringProps = {
  mutateSetSearchString: MutationFn<MutationData, MutationVariables>,
};
