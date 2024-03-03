import gql from 'graphql-tag';
import { OptionProps } from 'react-apollo/types';
import { Application } from '@src/graphql/queries';

export type ApplicationsRequestVariables = {
  filters: {
    name?: {
      contains: string,
    },
    additionalSearchTerms?: {
      contains: string,
    },
    search?: {
      contains: string,
    },
    isChromeExtension?: {
      eq: boolean,
    },
    category?: {
      contains: string,
    },
  },
  sort?: {
    field: string,
    direction: string,
  },
  first: number,
};

export interface ApplicationsResponse extends OptionProps {
  applications: {
    list: Application[],
    pageInfo?: {
      endCursor: number,
      hasNextPage: boolean,
    },
  },
  loading?: boolean,
}

export const QUERY_GET_APPLICATIONS = gql`
    query applications($first: Int!, $after: String, $filters: ApplicationsFilters, $sort: [SortOrderParameter!]) {
        applications(first: $first, after: $after, filters: $filters, sort: $sort) {
            list {
                id
                previousServiceId
                name
                category { name }
                themeColor
                iconURL
                startURL
                isChromeExtension
                bxAppManifestURL
                isPrivate
                isPreconfigurable
                preconfigurations {
                    onpremise
                    subdomain
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;
