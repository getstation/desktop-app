export const NEW_TAB = 'URLROUTER/NEW_TAB';
export const NEW_WINDOW = 'URLROUTER/NEW_WINDOW';
export const DEFAULT_BROWSER = 'URLROUTER/DEFAULT_BROWSER';

export type DispatchUrlOptions = {
  afterFollowingRedirects?: boolean,
  originalUrl?: string,
};

export type Targets = typeof NEW_TAB | typeof NEW_WINDOW | typeof DEFAULT_BROWSER;
