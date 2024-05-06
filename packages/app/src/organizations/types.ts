import { MinimalApplication } from '../applications/graphql/withApplications';

export type MinimalOrganization = {
  slug: string,
  name: string | null,
  domain: string,
  pictureUrl: string,
};

export type Organization = MinimalOrganization & {
  employees?: Employee[],
  totalEmployees: number,
};

export type OrganizationWithApplicationsCount = MinimalOrganization & {
  totalEmployees: number,
  employeesApplicationsConnection: {
    totalCount: number,
  },
};

export type OrganizationWithApplications = MinimalOrganization & {
  employeesApplicationsConnection: EmployeeInstalledApplications,
  totalEmployees: number,
};

export type EmployeeInstalledApplications = {
  totalCount: number
  edges: {
    node: MinimalApplication,
    employeesCount: number,
  }[],
  pageInfo: {
    endCursor: string,
    hasNextPage: boolean,
  },
};

export type Employee = {
  auth0userId: string,
  auth0User: Auth0User,
};

export type Auth0User = {
  email: string,
  email_verified: boolean,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
};
