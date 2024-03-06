import { URL } from 'url';
import { createGetDeepResourceId, createIdExtractor, ResourceRecord } from '../common/activity/resource';

/* URL scheme
 * https://docs.google.com/{document|spreadsheets|presentation}/d/{documentId}/edit#...
 * https://docs.google.com/a/{organisationDomainName}/{document|spreadsheets|presentation}/d/{documentId}/edit
 */

export const resourceExtractor = (url: string): ResourceRecord | null => {
  const urlObject = new URL(url);

  const fragments = urlObject.pathname
    .split('/')
    .filter(fragment => Boolean(fragment));

  const lastFragment = fragments[fragments.length - 1];

  if (fragments.includes('d')) {
    // compute resourceId on based on existing orga domain name or not
    const relativeIndex = fragments[0] === 'a' ? 2 : 0;
    const kind = fragments[relativeIndex];
    const resourceId = fragments[relativeIndex + 2];

    if (resourceId && kind) {
      return {
        resourceId,
        extraData: {
          kind,
        },
      };
    }
  } else if (fragments.includes('folders')) {
    const kind = 'folders';
    const resourceId = fragments[2];
    if (resourceId && kind) {
      return {
        resourceId,
        extraData: {
          kind,
        },
      };
    }
  } else if (lastFragment === 'my-drive') {
    return {
      resourceId: 'my-drive',
      extraData: {},
    };
  }

  return null;
};

export const idExtractor = createIdExtractor(resourceExtractor);
export const getDeepResourceId = createGetDeepResourceId(resourceExtractor);
