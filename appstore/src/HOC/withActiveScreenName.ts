import { graphql } from 'react-apollo';
import { GET_ACTIVE_SCREEN_NAME } from '@src/graphql/schemes/activeScreenName';

export type GetActiveScreenNameResponse = {
  activeScreenName: {
    value: string;
  };
};

export type WithActiveScreenNameProps = {
  activeScreenName: string;
};

export default graphql<{}, GetActiveScreenNameResponse, {}, WithActiveScreenNameProps>(GET_ACTIVE_SCREEN_NAME, {
  props: ({ data }) => ({
    activeScreenName: data!.activeScreenName!.value,
  }),
});
