import { MinimalApplication } from '../../app/applications/graphql/withApplications';
import { OrganizationWithApplications } from '../../app/organizations/types';

export const applications : MinimalApplication[] = [
  { id: 'slite', name: 'Slite', bxAppManifestURL: 'https://api.getstation.com/application-recipe/21/bxAppManifest.json', iconURL: 'https://cdn.filestackcontent.com/vSKDGvUSSaS4bx4Gn4nG', themeColor: '#42C299' },
  { id: 'calendar', name: 'Github', bxAppManifestURL: 'https://api.getstation.com/application-recipe/18/bxAppManifest.json', iconURL: 'https://cdn.filestackcontent.com/SoMG9urFTpGgqP2GVsdv', themeColor: '#3A82F5' },
  { id: 'drive', name: 'Airtable', bxAppManifestURL: 'https://api.getstation.com/application-recipe/16/bxAppManifest.json', iconURL: 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f', themeColor: '#FCCD48' },
];

export const myOrganization : OrganizationWithApplications = {
  slug: 'zevia-inc',
  name: 'Zevia',
  domain: 'zevia.com',
  pictureUrl: 'https://momsmeet.com/wp-content/uploads/2016/06/MA-ZEVI-17.06_logo-300x300-wpcf_280x280.jpg',
  totalEmployees: 12,
  employeesApplicationsConnection: {
    totalCount: 12,
    edges: [
      {
        node: applications[0],
        employeesCount: 7,
      },
      {
        node: applications[1],
        employeesCount: 4,
      },
      {
        node: applications[2],
        employeesCount: 2,
      },
    ],
    pageInfo: {
      endCursor: '',
      hasNextPage: false,
    },
  },
};
