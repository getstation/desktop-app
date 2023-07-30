import { MutationFn } from 'react-apollo';

export type MutationData = {
  data: {
    deleteApplication : boolean,
  },
};

type MutationVariables = {
  applicationId: string,
};

export type MutateDeleteApplicationProps = {
  mutateDeleteApplication: MutationFn<MutationData, MutationVariables>,
};
