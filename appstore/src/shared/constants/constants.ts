export const screenNames = {
  companyApps: 'COMPANY_APPS',
  mostPopulars: 'MOST_POPULAR',
  allApps: 'ALL_APPS',
  allExtensions: 'ALL_EXTENSIONS',
  boostedApps: 'BOOSTED_APPS',
  onboardEmployees: 'ONBOARD_EMPLOYEES',
  myCustomApps: 'MY_CUSTOM_APPS',
};

export enum screenHash {
  MOST_POPULAR = '#most-popular',
  ALL_APPS = '#all-apps',
  ALL_EXTENSIONS = '#all-extensions',
  BOOSTED_APPS = '#boosted-apps',
  MY_CUSTOM_APPS = '#custom-apps',
}

export const boostedTypes = {
  unifiedSearch: {
    title: 'Unified Search',
    value: 'unified-search',
  },
  notificationBadge: {
    title: 'Notification Badge',
    value: 'notification-badge',
  },
  statusSync: {
    title: 'Status Sync',
    value: 'status-sync',
  },
};

export const customAppsCategories = {
  privateApps: 'My Private Apps',
  companyApps: 'Company Apps',
};

export const customAppsMode = {
  createMode: 'CREATE_MODE',
  editMode: 'EDIT_MODE',
};

export enum AppDataValidationErrors {
  AppName = 'Enter an app name',
  AppColor = 'Missing or invalid icon color',
  AppLogo = 'Missing or invalid logo url',
  AppUrl = 'Missing or invalid signin url',
}

export const minAppNameLength = 2;

export const allAppsCategoriesList = [
  {
    title: 'Accounting & Finance',
    icon: '#i--bank',
  },
  {
    title: 'Admin & Back-office',
    icon: '#i--nas',
  },
  {
    title: 'Blogging & Content Creation',
    icon: '#i--google-search',
  },
  {
    title: 'Communication & Collaboration',
    icon: '#i--megaphone',
  },
  {
    title: 'Curation & Sourcing',
    icon: '#i--pie-chart',
  },
  {
    title: 'Design & Creativity',
    icon: '#i--design',
  },
  {
    title: 'Developer Tools',
    icon: '#i--code',
  },
  {
    title: 'HR & Legal',
    icon: '#i--law',
  },
  {
    title: 'Marketing & Analytics',
    icon: '#i--chart',
  },
  {
    title: 'Sales & CRM',
    icon: '#i--filled-filter',
  },
  {
    title: 'Social Media & Advertising',
    icon: '#i--chat',
  },
  {
    title: 'Storage & File-sharing',
    icon: '#i--network-drive',
  },
  {
    title: 'Task & Project Management',
    icon: '#i--survey',
  },
  {
    title: 'User Support & Survey',
    icon: '#i--headset',
  },
  {
    title: 'Miscellaneous',
    icon: '#i--categorize',
  },
];

export const applicationsLimit = 200;

export const animStylesData = {
  translateRight: '125%',
  translateLeft: '-125%',
  transitionTime: '.5s',
};

export const svgIconsURLs = [
  'station://appstore/static/custom-app-icons/icon-simple-1.svg',
  'station://appstore/static/custom-app-icons/icon-simple-2.svg',
  'station://appstore/static/custom-app-icons/icon-simple-3.svg',
  'station://appstore/static/custom-app-icons/icon-simple-4.svg',
  'station://appstore/static/custom-app-icons/icon-simple-5.svg',
  'station://appstore/static/custom-app-icons/icon-simple-6.svg',
  'station://appstore/static/custom-app-icons/icon-simple-7.svg',
  'station://appstore/static/custom-app-icons/icon-simple-8.svg',
  'station://appstore/static/custom-app-icons/icon-simple-9.svg',
  'station://appstore/static/custom-app-icons/icon-simple-10.svg',
  'station://appstore/static/custom-app-icons/icon-simple-11.svg',
  'station://appstore/static/custom-app-icons/icon-simple-12.svg',
  'station://appstore/static/custom-app-icons/icon-simple-13.svg',
  'station://appstore/static/custom-app-icons/icon-simple-14.svg',
  'station://appstore/static/custom-app-icons/icon-simple-15.svg',
  'station://appstore/static/custom-app-icons/icon-simple-16.svg',
  'station://appstore/static/custom-app-icons/icon-simple-17.svg',
  'station://appstore/static/custom-app-icons/icon-simple-18.svg',
  'station://appstore/static/custom-app-icons/icon-simple-19.svg',
  'station://appstore/static/custom-app-icons/icon-simple-20.svg',
  'station://appstore/static/custom-app-icons/icon-simple-21.svg',
  'station://appstore/static/custom-app-icons/icon-simple-22.svg',
  'station://appstore/static/custom-app-icons/icon-simple-23.svg',
  'station://appstore/static/custom-app-icons/icon-simple-24.svg',
  'station://appstore/static/custom-app-icons/icon-simple-25.svg',
  'station://appstore/static/custom-app-icons/icon-simple-26.svg',
  'station://appstore/static/custom-app-icons/icon-simple-27.svg',
  'station://appstore/static/custom-app-icons/icon-simple-28.svg',
  'station://appstore/static/custom-app-icons/icon-simple-29.svg',
  'station://appstore/static/custom-app-icons/icon-simple-30.svg',
  'station://appstore/static/custom-app-icons/icon-simple-31.svg',
  'station://appstore/static/custom-app-icons/icon-simple-32.svg',
  'station://appstore/static/custom-app-icons/icon-simple-33.svg',
  'station://appstore/static/custom-app-icons/icon-simple-34.svg',
  'station://appstore/static/custom-app-icons/icon-simple-35.svg',
  'station://appstore/static/custom-app-icons/icon-simple-36.svg',
  'station://appstore/static/custom-app-icons/icon-simple-37.svg',
  'station://appstore/static/custom-app-icons/icon-simple-38.svg',
  'station://appstore/static/custom-app-icons/icon-simple-39.svg',
  'station://appstore/static/custom-app-icons/icon-simple-40.svg',
  'station://appstore/static/custom-app-icons/icon-simple-41.svg',
  'station://appstore/static/custom-app-icons/icon-simple-42.svg',
  'station://appstore/static/custom-app-icons/icon-simple-43.svg',
  'station://appstore/static/custom-app-icons/icon-simple-44.svg',
  'station://appstore/static/custom-app-icons/icon-simple-45.svg',
  'station://appstore/static/custom-app-icons/icon-simple-46.svg',
  'station://appstore/static/custom-app-icons/icon-simple-47.svg',
  'station://appstore/static/custom-app-icons/icon-simple-48.svg',
  'station://appstore/static/custom-app-icons/icon-simple-49.svg',
  'station://appstore/static/custom-app-icons/icon-simple-50.svg',
  'station://appstore/static/custom-app-icons/icon-simple-51.svg',
  'station://appstore/static/custom-app-icons/icon-simple-52.svg',
  'station://appstore/static/custom-app-icons/icon-simple-53.svg',
  'station://appstore/static/custom-app-icons/icon-simple-54.svg',
  'station://appstore/static/custom-app-icons/icon-simple-55.svg',
  'station://appstore/static/custom-app-icons/icon-simple-56.svg',
];

export const applicationNameMaxWidth = 143;
