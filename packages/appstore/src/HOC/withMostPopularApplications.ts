// import { graphql } from 'react-apollo';

import { ApplicationsAvailable } from '../graphql/queries';
// import { ApplicationsResponse, QUERY_GET_APPLICATIONS } from '../graphql/schemes/applications';
import { TMP_MOST_POP_APPS } from '../applications/mockedMostPopularApps';

export type MostPopularApplicationsRequestVariables = {
  first: number,
  sort: {
    field: string,
    direction: string,
  },
};

export type WithMostPopularApplicationsProps = {
  apps?: {
    creamOfTheCropApps: ApplicationsAvailable[],
    runnerUps: ApplicationsAvailable[],
    noteworthy: ApplicationsAvailable[],
  },
  loading?: boolean,
};

export const mostPopularApplications = () : WithMostPopularApplicationsProps['apps'] => {
  return TMP_MOST_POP_APPS;
};

// export default graphql<{}, ApplicationsResponse, MostPopularApplicationsRequestVariables, WithMostPopularApplicationsProps>(
//   QUERY_GET_APPLICATIONS,
//   {
//     options: () => {
//       return {
//         variables: {
//           first: 100,
//           sort: {
//             field: 'popularity',
//             direction: 'DESC',
//           },
//         },
//       };
//     },
//     props: ({ data }) => {
//       const appsList = data && data!.applications && data!.applications!.list || [];
//       const creamOfTheCropApps = appsList.slice(0, 20);
//       const runnerUps = appsList.slice(20, 50);
//       const noteworthy = appsList.slice(50, 100);
//       return ({
//         apps: {
//           creamOfTheCropApps,
//           runnerUps,
//           noteworthy,
//         },
//         loading: data && data.loading,
//       });
//     },
//   });
