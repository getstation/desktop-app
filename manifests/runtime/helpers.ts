const fs = require('fs');
const path = require('path');

export const ICON_PROVIDER_DIR = 'static/icon--provider';

export const readFile = (type, filename) =>
  fs.readFileSync(path.join(type, filename), { encoding: 'utf8' });

export const getIconPath = (iconId: string) => `${ICON_PROVIDER_DIR}/icon-provider--${iconId}.svg`;

export const RegExpKeys = ['URLHandlingIntentFilter', 'URLHandlingHostnameFilter', 'captiveURLScheme', 'restrictedEmails'];

export const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);
