import { MutationFn } from 'react-apollo';
import { Application } from '@src/graphql/queries';

export type MutationData = {
  data: {
    setSelectedCustomApp: {
      app: Application,
    },
  },
};

type MutationVariables = {
  app: Application,
};

export type MutateSetSelectedCustomAppProps = {
  mutateSetSelectedCustomApp: MutationFn<MutationData, MutationVariables>,
};
