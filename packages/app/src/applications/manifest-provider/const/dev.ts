// git update-index --assume-unchanged app/applications/manifest-provider/const/dev.ts

export const SLACK_STATION_NEXT_MANIFEST_URL = 'http://localhost:4001/application-recipe/2171/bxAppManifest.json';

// Custom Integrations
export const SLACK_MANIFEST_URL = 'http://localhost:4001/application-recipe/21/bxAppManifest.json';
export const GDRIVE_MANIFEST_URL = 'http://localhost:4001/application-recipe/16/bxAppManifest.json';

// Applications with dialog hint
export const GCALENDAR_MANIFEST_URL = 'http://localhost:4001/application-recipe/18/bxAppManifest.json';

export const APPLICATIONS_WITH_DIALOG_HINT = [
  GCALENDAR_MANIFEST_URL,
];

// Applications Extensions
export const MIXMAX_MANIFEST_URL = 'http://localhost:4001/application-recipe/267/bxAppManifest.json';
export const CLEARBIT_MANIFEST_URL = 'http://localhost:4001/application-recipe/286/bxAppManifest.json';
export const GMELIUS_MANIFEST_URL = 'http://localhost:4001/application-recipe/287/bxAppManifest.json';
export const MAILTRACKER_MANIFEST_URL = 'http://localhost:4001/application-recipe/288/bxAppManifest.json';
export const BOOMERANG_MANIFEST_URL = 'http://localhost:4001/application-recipe/415/bxAppManifest.json';

// Applications receiving Chrome Extensions
export const GMAIL_MANIFEST_URL = 'http://localhost:4001/application-recipe/14/bxAppManifest.json';
export const SALESFORCE_MANIFEST_URL = 'http://localhost:4001/application-recipe/38/bxAppManifest.json';

// Applications with custom subdock titles
export const OFFICE365_MANIFEST_URL = 'http://localhost:4001/application-recipe/254/bxAppManifest.json';

export const APPLICATIONS_WITH_CUSTOM_SUBDOCK_TITLE: Record<string, { regex: RegExp, icon: string }[]> = {
  [GDRIVE_MANIFEST_URL]: [
    {
      regex: /\/document\//,
      icon: 'doc',
    },
    {
      regex: /\/spreadsheets\//,
      icon: 'sheet',
    },
    {
      regex: /\/presentation\//,
      icon: 'slide',
    },
  ],
  [OFFICE365_MANIFEST_URL]: [
    {
      regex: /&app=Word&/,
      icon: 'doc',
    },
    {
      regex: /&app=Excel&/,
      icon: 'sheet',
    },
    {
      regex: /&app=PowerPoint&/,
      icon: 'slide',
    },
  ],
};
