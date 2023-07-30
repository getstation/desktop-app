import { screenNames } from '@src/shared/constants/constants';

export interface SearchLocalState {
  searchString: string,
  searchStringAfterEnterPress?: string,
  isEnterPressed?: boolean,
  __typename: string,
}

export default {
  isBurgerOpen: {
    value: false,
    __typename: 'IsBurgerOpen',
  },
  search: {
    searchString: '',
    searchStringAfterEnterPress: '',
    isEnterPressed: false,
    __typename: 'SearchString',
  },
  activeScreenName: {
    value: screenNames.companyApps,
    __typename: 'ActiveScreenName',
  },
  appRequestMode: {
    appRequestIsOpen: false,
    currentMode: '',
    __typename: 'AppRequestMode',
  },
  selectedCustomApp: {
    app: {
      id: '',
      bxAppManifestURL: '',
      category: {
        name: '',
        __typename: 'ApplicationCategory',
      },
      iconURL: '',
      startURL: '',
      isChromeExtension: false,
      name: '',
      themeColor: '',
      __typename: 'Application',
    },
    __typename: 'SelectedCustomApp',
  },
  appModalStatus: {
    isAppModalOpen: false,
    __typename: 'AppModalStatus',
  },
};
