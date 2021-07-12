export type ApplicationItem = {
  name: string,
  bxAppManifestURL: string,
  manifest: {
    scope: string,
    extended_scopes: string[],
  };
};

export type ApplicationConnectionNode = {
  node: ApplicationItem,
};

export type ApplicationConnectionResponse = {
  applicationsConnection: {
    edges: ApplicationConnectionNode[] | null,
  } | null,
};

export interface RoutingOrigin {
  tabId?: string,
  applicationId?: string,
}

export interface ParsedURL {
  protocol: string,
  subdomain?: string | null,
  domain: string,
  port?: string | null,
  pathname?: string | null,
}

export enum URLRouterAction {
  RELOAD = 'RELOAD',
  NAV_TO_TAB = 'NAV_TO_TAB',
  NEW_TAB = 'NEW_TAB',
  NEW_WINDOW = 'NEW_WINDOW',
  NAV_IN_TAB = 'NAV_IN_TAB',
  INSTALL_AND_OPEN = 'INSTALL_AND_OPEN',
  DEFAULT_BROWSER = 'DEFAULT_BROWSER',
  PUSH_AND_NAV_TO_TAB = 'PUSH_AND_NAV_TO_TAB',
}

export type URLRouterActionAndDestination =
  [URLRouterAction.RELOAD, { tabId: string }] |
  [URLRouterAction.NAV_TO_TAB, { tabId: string }] |
  [URLRouterAction.NEW_TAB, RoutingOrigin] |
  [URLRouterAction.NEW_WINDOW, RoutingOrigin] |
  [URLRouterAction.NAV_IN_TAB, RoutingOrigin] |
  [URLRouterAction.INSTALL_AND_OPEN, { manifestURL: string }] |
  [URLRouterAction.DEFAULT_BROWSER, null] |
  [URLRouterAction.PUSH_AND_NAV_TO_TAB, { tabId: string }];
