import { activity } from '@getstation/sdk';

export type ResourceRecord = {
  resourceId: string,
  extraData: any,
  type?: string,
};

export type ResourceExtractor = (url: string) => ResourceRecord | null;

export const createIdExtractor = (resourceExtractor: ResourceExtractor) => (url: string): string | null => {
  if (!url) return null;
  const resource = resourceExtractor(url);
  if (resource) {
    return resource.resourceId;
  }
  return null;
};

export const createGetDeepResourceId = (resourceExtractor: ResourceExtractor) => {
  const idExtractor = createIdExtractor(resourceExtractor);
  return (item: activity.ActivityEntry): string | null => {
    if (item.type === 'nav-to-tab') {
      return idExtractor(item.extraData.tabUrl);
    }
    return item.resourceId;
  };
};
