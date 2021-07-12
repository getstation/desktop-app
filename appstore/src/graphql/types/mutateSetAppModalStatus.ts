import { MutationFn } from 'react-apollo';

export type MutationData = {
  data: {
    setAppModalStatus: {
      isAppModalOpen: boolean,
    },
  },
};

type MutationVariables = {
  isAppModalOpen: boolean,
};

export type MutateSetAppModalStatusProps = {
  mutateSetAppModalStatus: MutationFn<MutationData, MutationVariables>,
};
