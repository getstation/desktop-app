import memoizee = require('memoizee');

export const stripUuid = memoizee((id: string): string =>
  id.replace(/-/g, ''));

export const unstripUuid = memoizee((id: string): string =>
  id.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5'));

export const isStrippedUUID = memoizee((uuid: string): boolean =>
  /^[0-9a-f]{32}$/i.test(uuid));
