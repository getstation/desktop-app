import { resources, SDK } from '@getstation/sdk';
import { EMPTY, Observable } from 'rxjs';

import { idExtractor } from './activity';
import SlackSearch from './search';
import SlackTeam from './search/slack-team';

export const getTeam = async (url: string): Promise<SlackTeam | undefined> => {
  const { hostname, pathname } = new URL(url);

  if (hostname === 'app.slack.com') {
    const teamId = pathname.split('/')[2];
    const team = await SlackSearch.getTeam(teamId);

    if (team) {
      return team;
    }

    return undefined;
  }

  const subdomain = hostname.replace('.slack.com', '');

  const teamBySubdomain = await SlackSearch.findTeamByDomain(subdomain);

  if (teamBySubdomain) {
    return teamBySubdomain;
  }

  return undefined;
};

export const urlForResource = (
  teamDomain: string,
  resourceId: string
): string => {
  return `https://${teamDomain}.slack.com/messages/${resourceId}`;
};

export const getOpenHandler = (sdk: SDK) => async (url: string) => {
  const team = await getTeam(url);

  if (!team) {
    throw new Error(`Slack Team '${url}' cannot be found`);
  }

  const teamTab = sdk.tabs.getTabs()
    .find(tab => tab.url.startsWith(team.teamDomain)) || sdk.tabs.getTabs()
      .find(tab => tab.url.includes(team.teamId));

  if (!teamTab) {
    throw new Error(`Slack Team tab for '${url}' cannot be found`);
  }

  const { tabId } = teamTab;

  const resourceId = idExtractor(url);

  let code: string;

  if (teamTab.url.startsWith('https://app.slack.com')) {
    code = `
      var state = { page: '/client/${team.teamId}/${resourceId}/' };
      history.pushState(state, '', 'https://app.slack.com/client/${team.teamId}/${resourceId}/');
      var popStateEvent = new PopStateEvent('popstate', { state: state });
      dispatchEvent(popStateEvent);
    `;
  } else {
    code = `
      var state = { page: '/messages/${resourceId}/' };
      history.pushState(state, '', 'https://${team.teamDomain}.slack.com/messages/${resourceId}/');
      var popStateEvent = new PopStateEvent('popstate', { state: state });
      dispatchEvent(popStateEvent);
    `;
  }

  if (resourceId === idExtractor(teamTab.url)) {
    await sdk.tabs.navToTab(tabId);
  } else {
    await sdk.tabs.navToTab(tabId, { silent: true });
    await sdk.tabs.executeJavaScript(tabId, code);
  }
};

const getMetadataHandler = (sdk: SDK) => async (
  url: string,
  defaultMetadata: resources.ResourceMetaData
) => {
  void sdk;
  const team = await getTeam(url);

  if (!team) {
    throw new Error(`Slack Team '${url}' cannot be found`);
  }

  const resourceId = idExtractor(url);

  if (!resourceId) {
    return defaultMetadata;
  }

  const item = team.get(resourceId);

  if (!item) {
    return defaultMetadata;
  }

  return {
    ...defaultMetadata,
    title: item.label,
    image: item.imgUrl,
    description: team.teamName,
  };
};

export const setResourcesHandlers = (sdk: SDK): Observable<Error> => {
  sdk.resources.setOpenHandler(getOpenHandler(sdk));
  sdk.resources.setMetaDataHandler(getMetadataHandler(sdk));
  return EMPTY;
};
