import { compact } from 'ramda-adjunct';
import { URL } from 'url';

import {
  createGetDeepResourceId,
  createIdExtractor,
  ResourceRecord,
} from '../common/activity/resource';

/* URL scheme
*
* As of Nov 2, 2018
* https://{teamDomain}.slack.com/messages/{resourceId}/convo/{messageId}-{timestamp}/
*
* As of Jul 18, 2019
* https://app.slack.com/client/{teamId}/threads|unreads/
* https://app.slack.com/client/{teamId}/{resourceId}/
* https://app.slack.com/client/{teamId}/{resourceId}/thread/{messageId}-{timestamp}/
*
*/

const createResource = (resourceId: string, teamId: string) => {
  if (!resourceId || !teamId) return null;
  return {
    resourceId,
    extraData: { teamId },
  };
};

const createLegacyResource = (resourceId: string, domain: string) => {
  if (!resourceId || !domain) return null;
  return {
    resourceId,
    extraData: { domain },
  };
};

export const resourceExtractor = (url: string): ResourceRecord | null => {
  const { hostname, pathname } = new URL(url);

  const fragments = compact(pathname.split('/'));

  // As of Jul 18, 2019
  if (hostname === 'app.slack.com') {
    const [, teamId, resourceId] = fragments;
    return createResource(resourceId, teamId);
  }

  // As of Nov 2, 2018
  const domain = hostname.replace('.slack.com', '');
  if (fragments[0] === 'messages') {
    const [, resourceId] = fragments;
    return createLegacyResource(resourceId, domain);
  }
  if (fragments[0] === 'threads' || fragments[0] === 'unreads') {
    return createLegacyResource(fragments[0], domain);
  }

  return null;
};

export const idExtractor = createIdExtractor(resourceExtractor);
export const getDeepResourceId = createGetDeepResourceId(resourceExtractor);
