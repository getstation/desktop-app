const ALL_MOCKED_APPS = [
  {
    id: 'recipe/14',
    previousServiceId: 'gmail',
    name: 'Gmail',
    category: {
      name: 'Communication & Collaboration',
      __typename: 'ApplicationCategory',
    },
    themeColor: '#e75a4d',
    iconURL: 'https://cdn.filestackcontent.com/Yxw83DJdRW2N2PkcDFGA',
    startURL:
      'https://accounts.google.com/AddSession?passive=true&Email={{userIdentity.profileData.email}}&continue=https://mail.google.com/mail/u/{{userIdentity.profileData.email}}',
    isChromeExtension: false,
    bxAppManifestURL:
      'http://localhost:4001/application-recipe/14/bxAppManifest.json',
    isPrivate: null,
    isPreconfigurable: false,
    preconfigurations: null,
    __typename: 'Application',
  },
  {
    id: 'recipe/18',
    previousServiceId: 'gcalendar-mu',
    name: 'Google Calendar',
    category: {
      name: 'Communication & Collaboration',
      __typename: 'ApplicationCategory',
    },
    themeColor: '#3A82F5',
    iconURL: 'https://cdn.filestackcontent.com/SoMG9urFTpGgqP2GVsdv',
    startURL:
      'https://calendar.google.com/calendar/{{#if moreThanOneIdentity}}b/{{userIdentity.profileData.email}}{{/if}}',
    isChromeExtension: false,
    bxAppManifestURL:
      'http://localhost:4001/application-recipe/18/bxAppManifest.json',
    isPrivate: null,
    isPreconfigurable: false,
    preconfigurations: null,
    __typename: 'Application',
  },
  {
    id: 'recipe/16',
    previousServiceId: 'gdrive-mu',
    name: 'Google Drive',
    category: {
      name: 'Storage & File-sharing',
      __typename: 'ApplicationCategory',
    },
    themeColor: '#FCCD48',
    iconURL: 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f',
    startURL:
      'https://accounts.google.com/AddSession?passive=true&Email={{userIdentity.profileData.email}}&continue=https://drive.google.com/drive/{{#if moreThanOneIdentity}}u/{{userIdentity.profileData.email}}{{/if}}',
    isChromeExtension: false,
    bxAppManifestURL:
      'http://localhost:4001/application-recipe/16/bxAppManifest.json',
    isPrivate: null,
    isPreconfigurable: false,
    preconfigurations: null,
    __typename: 'Application',
  },
];
export { ALL_MOCKED_APPS };
