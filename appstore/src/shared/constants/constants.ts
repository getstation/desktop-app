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
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-1.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-10.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-11.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-12.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-13.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-14.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-15.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-16.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-17.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-18.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-19.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-2.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-20.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-21.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-22.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-23.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-24.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-25.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-26.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-27.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-28.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-29.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-3.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-30.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-31.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-32.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-33.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-34.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-35.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-36.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-37.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-38.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-39.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-4.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-40.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-41.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-42.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-43.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-44.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-45.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-46.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-47.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-48.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-49.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-5.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-50.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-51.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-52.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-53.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-54.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-55.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-56.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-6.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-7.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-8.svg',
  'https://s3.eu-west-2.amazonaws.com/assets.getstation.com/appstore/icon-simple-9.svg',
];

export const applicationNameMaxWidth = 143;
