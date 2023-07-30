import { graphql } from 'react-apollo';
import { GET_SELECTED_CUSTOM_APP } from '@src/graphql/schemes/selectedCustomApp';

import { Application } from '../graphql/queries';

export interface ApplicationResponse {
  selectedCustomApp: {
    app: Application,
  },
  loading?: boolean,
}

export type WithSelectedCustomAppProps = {
  app: Application,
  loading?: boolean,
};

export default graphql<{}, ApplicationResponse, {}, WithSelectedCustomAppProps>(GET_SELECTED_CUSTOM_APP,
  {
    props: ({ data }) => ({
      app: data!.selectedCustomApp!.app,
      loading: data && data.loading,
    }),
  });
