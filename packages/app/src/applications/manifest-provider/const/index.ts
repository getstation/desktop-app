import { isPackaged } from '../../../utils/env';
import * as dev from './dev';
import * as prod from './prod';

const consts = isPackaged ? prod : dev;

export const SLACK_STATION_NEXT_MANIFEST_URL = consts.SLACK_STATION_NEXT_MANIFEST_URL;

// Custom Integrations
export const SLACK_MANIFEST_URL = consts.SLACK_MANIFEST_URL;
export const GDRIVE_MANIFEST_URL = consts.GDRIVE_MANIFEST_URL;

// Applications with dialog hint
export const APPLICATIONS_WITH_DIALOG_HINT = consts.APPLICATIONS_WITH_DIALOG_HINT;

// Applications Extensions
export const MIXMAX_MANIFEST_URL = consts.MIXMAX_MANIFEST_URL;
export const CLEARBIT_MANIFEST_URL = consts.CLEARBIT_MANIFEST_URL;
export const GMELIUS_MANIFEST_URL = consts.GMELIUS_MANIFEST_URL;
export const MAILTRACKER_MANIFEST_URL = consts.MAILTRACKER_MANIFEST_URL;
export const BOOMERANG_MANIFEST_URL = consts.BOOMERANG_MANIFEST_URL;

// Applications receiving Chrome Extensions
export const GMAIL_MANIFEST_URL = consts.GMAIL_MANIFEST_URL;
export const SALESFORCE_MANIFEST_URL = consts.SALESFORCE_MANIFEST_URL;

export const APPLICATIONS_WITH_CUSTOM_SUBDOCK_TITLE = consts.APPLICATIONS_WITH_CUSTOM_SUBDOCK_TITLE;

// JavaScript Injection
export const JAVASCRIPT_INJECTIONS = {
  asana: ['asanaInjectedScript'],
  gmail: ['gmailInjectedScript'],
  slack: ['slackInjectedScript'],
  'station-support': ['slackInjectedScript'],
  'gdrive-mu':    ['removeGoogleAccountInjectedScript'],
  'gcalendar-mu': ['removeGoogleAccountInjectedScript'],
  'google-cloud': ['removeGoogleAccountInjectedScript'],  //vk: FIXME: doesn't work
  'google-keep':  ['removeGoogleAccountInjectedScript'],
  'meet':         ['removeGoogleAccountInjectedScript'],
  outlook: ['office365InjectedScript'],
  'office-365': ['office365InjectedScript'],
  'outlook-pro': ['office365InjectedScript'],
  'facebook-messenger': ['messengerInjectedScript'],
  'whatsapp': ['whatsappInjectedScript'],
};

// Internal Applications
export const INTERNAL_APPLICATIONS = [
  process.env.APP_STORE_MANIFEST_URL!,
];
