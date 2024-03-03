import { URL } from 'url';
import { createGetDeepResourceId, createIdExtractor, ResourceRecord } from '../common/activity/resource';
import { isStrippedUUID } from './gateway/helpers';

/* URLS scheme
 * https://www.notion.so/{workspaceName}/{pageName}-{pageUuid}
 * https://www.notion.so/{workspaceName}/{pageUuid}
 * https://www.notion.so/{pageUuid}
 */

export const resourceExtractor = (url: string): ResourceRecord | null => {
  const fragments = new URL(url).pathname
    .split('/')
    .filter(fragment => Boolean(fragment));

  if (fragments.length === 1) {
    const resourceId = fragments[0];
    if (isStrippedUUID(resourceId)) return { resourceId, extraData: {} };
  }

  if (fragments.length === 2) {
    const resourceIdFromSubDomainWithPossibleTitle = fragments[1].split('-');
    if (resourceIdFromSubDomainWithPossibleTitle.length > 1) {
      const resourceId = resourceIdFromSubDomainWithPossibleTitle[resourceIdFromSubDomainWithPossibleTitle.length - 1];
      if (isStrippedUUID(resourceId)) return { resourceId, extraData: {} };
    }

    if (resourceIdFromSubDomainWithPossibleTitle.length === 1) {
      const resourceId = resourceIdFromSubDomainWithPossibleTitle[0];
      if (isStrippedUUID(resourceId)) return { resourceId, extraData: {} };
    }
  }

  return null;
};

export const idExtractor = createIdExtractor(resourceExtractor);
export const getDeepResourceId = createGetDeepResourceId(resourceExtractor);
