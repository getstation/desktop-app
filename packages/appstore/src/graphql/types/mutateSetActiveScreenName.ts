import { MutationFn } from 'react-apollo';

export type MutationData = {
  data: {
    setActiveScreenName: {
      activeScreenName: string,
    },
  },
};

type MutationVariables = {
  activeScreenName: string,
};

export type MutateSetActiveScreenNameProps = {
  mutateSetActiveScreenName: MutationFn<MutationData, MutationVariables>,
};
