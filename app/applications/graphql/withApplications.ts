export type MinimalApplication = {
  id: string,
  name: string,
  bxAppManifestURL: string,
  iconURL: string,
  themeColor: string,
  isChromeExtension: boolean,
};

export type Data<TApplication = MinimalApplication> = {
  applicationsConnection: {
    edges: { node: TApplication}[] | null,
  } | null,
  loading: boolean | null,
};

export type Props<TApplication = MinimalApplication> = {
  applications: TApplication[],
  applicationsLoading: boolean,
  applicationsSearchResults: TApplication[],
  applicationsSearchLoading: boolean,
  findApplications: (term: string) => void,
};
