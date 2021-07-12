import { MutationFn } from 'react-apollo';

export type MutationData = {
  data: {
    setCustomAppRequestMode: {
      appRequestIsOpen: boolean,
      currentMode: string,
    },
  },
};

type MutationVariables = {
  appRequestIsOpen: boolean,
  currentMode: string,
};

export type MutateSetCustomAppRequestModeProps = {
  mutateSetCustomAppRequestMode: MutationFn<MutationData, MutationVariables>,
};
