/* tslint:disable */

export interface AllApplicationsAndCategories {
  applications: {
    list: Application[]
  },
  categories: Category[]
}

export interface Category {
  name: string,
}

type Preconfigurations = {
  onpremise: boolean,
  subdomain: string,
};

export interface Application {
  id: string,
  name: string,
  category: Category,
  themeColor: string,
  iconURL: string,
  startURL: string,
  isChromeExtension: boolean,
  bxAppManifestURL: string
  isPrivate?: boolean | null,
  isPreconfigurable?: boolean | null,
  preconfigurations?: Preconfigurations | null,
}

export type ApplicationsAvailable = Application;
