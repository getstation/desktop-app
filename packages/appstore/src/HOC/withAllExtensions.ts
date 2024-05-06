import { graphql } from 'react-apollo';

import { ApplicationsAvailable } from '../graphql/queries';
import {
  QUERY_GET_APPLICATIONS,
  ApplicationsRequestVariables,
  ApplicationsResponse,
} from '../graphql/schemes/applications';
import { applicationsLimit } from '../shared/constants/constants';

export type WithAllExtensionsProps = {
  apps?: ApplicationsAvailable[],
  loading?: boolean,
};

export default graphql<{}, ApplicationsResponse, ApplicationsRequestVariables, WithAllExtensionsProps>(QUERY_GET_APPLICATIONS, {
  options: () => {
    return {
      variables: {
        filters: {
          isChromeExtension: {
            eq: true,
          },
        },
        sort: {
          field: 'name',
          direction: 'ASC',
        },
        first: applicationsLimit,
      },
    };
  },
  props: ({ data }) => ({
    apps: data && data.applications ? data.applications.list : [],
    loading: data && data.loading,
  }),
});
