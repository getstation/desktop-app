import { MutationFn } from 'react-apollo';

export type MutationData = {
  data: {
    setBurgerStatus: {
      isBurgerOpen: boolean,
    },
  },
};

type MutationVariables = {
  isBurgerOpen: boolean,
};

export type MutateSetBurgerStatusProps = {
  mutateSetBurgerStatus: MutationFn<MutationData, MutationVariables>,
};
