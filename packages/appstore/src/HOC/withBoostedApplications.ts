import { graphql } from 'react-apollo';
// import { applicationsLimit, boostedTypes } from '../shared/constants/constants';
// import { QUERY_GET_BOOSTED_APPLICATIONS } from '../graphql/schemes/boostedApplications';
import { ALL_MOCKED_APPS } from '@src/applications/mockedAllAppsTemp';

import { ApplicationsAvailable } from '../graphql/queries';

export type BoostedApplicationsRequestVariables = {
  filterByUnifiedSearch: {
    boostedFeatures?: {
      contains: string,
    },
  },
  filterByNotificationBadge: {
    boostedFeatures?: {
      contains: string,
    },
  },
  filterByStatusSync: {
    boostedFeatures?: {
      contains: string,
    },
  },
  sort: {
    field: string,
    direction: string,
  },
  first: number,
};

export type BoostedApplicationsResponse = {
  appsUnifiedSearch?: {list: ApplicationsAvailable[]}
  appNotificationBadge?: {list: ApplicationsAvailable[]},
  appStatusSync?: {list: ApplicationsAvailable[]},
  loading?: boolean,
};

export type WithBoostedApplicationsProps = {
  appsUnifiedSearch?: ApplicationsAvailable[],
  appNotificationBadge?: ApplicationsAvailable[],
  appStatusSync?: ApplicationsAvailable[],
  loading?: boolean,
};

export const boostedApplications = () => {
  return {
    apps: ALL_MOCKED_APPS,
    loading: false,
  };
};

// export default graphql<{}, BoostedApplicationsResponse, BoostedApplicationsRequestVariables, WithBoostedApplicationsProps>(
//   QUERY_GET_BOOSTED_APPLICATIONS,
//   {
//     options: () => {
//       return {
//         variables: {
//           filterByUnifiedSearch: {
//             boostedFeatures: {
//               contains: boostedTypes.unifiedSearch.value,
//             },
//           },
//           filterByNotificationBadge: {
//             boostedFeatures: {
//               contains: boostedTypes.notificationBadge.value,
//             },
//           },
//           filterByStatusSync: {
//             boostedFeatures: {
//               contains: boostedTypes.statusSync.value,
//             },
//           },
//           sort: {
//             field: 'name',
//             direction: 'ASC',
//           },
//           first: applicationsLimit,
//         },
//       };
//     },
//     props: ({ data }) => ({
//       appsUnifiedSearch: data && data.appsUnifiedSearch ? data.appsUnifiedSearch.list : [],
//       appNotificationBadge: data && data.appNotificationBadge ? data.appNotificationBadge.list : [],
//       appStatusSync: data && data.appStatusSync ? data.appStatusSync.list : [],
//       loading: data && data.loading,
//     }),
//   });
