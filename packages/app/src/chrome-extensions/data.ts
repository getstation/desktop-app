import {
  GMAIL_MANIFEST_URL,
  SALESFORCE_MANIFEST_URL,
  MIXMAX_MANIFEST_URL,
  CLEARBIT_MANIFEST_URL,
  GMELIUS_MANIFEST_URL,
  MAILTRACKER_MANIFEST_URL,
  BOOMERANG_MANIFEST_URL,
} from '../applications/manifest-provider/const';

export default [
  {
    manifestURL: MIXMAX_MANIFEST_URL,
    extensionFor: [
      GMAIL_MANIFEST_URL,
      SALESFORCE_MANIFEST_URL,
    ],
  },
  {
    manifestURL: CLEARBIT_MANIFEST_URL,
    extensionFor: [
      GMAIL_MANIFEST_URL,
    ],
  },
  {
    manifestURL: GMELIUS_MANIFEST_URL,
    extensionFor: [
      GMAIL_MANIFEST_URL,
      SALESFORCE_MANIFEST_URL,
    ],
  },
  {
    manifestURL: MAILTRACKER_MANIFEST_URL,
    extensionFor: [
      GMAIL_MANIFEST_URL,
    ],
  },
  {
    manifestURL: BOOMERANG_MANIFEST_URL,
    extensionFor: [
      GMAIL_MANIFEST_URL,
    ],
  },
];
