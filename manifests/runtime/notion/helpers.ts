import { SDK } from '@getstation/sdk';
import { path } from 'ramda';
import { idExtractor } from './activity';
import {
  logo,
  serviceDomain,
  serviceName,
} from './main';

const isURL = (v: string) => {
  try {
    return Boolean(new URL(v));
  } catch (_) {
    return false;
  }
};

const getLabelForPage = (value: any): string | undefined => {
  const icon = value.format && value.format.page_icon && !isURL(value.format.page_icon) ? value.format.page_icon : '📄';
  const name = path(['properties', 'title', 0, 0], value);

  if (name) {
    return `${icon} ${name}`;
  }
  return undefined;
};

const getLabelForCollectionPage = (value: any): string | undefined => {
  try {
    const icon = value.icon && !isURL(value.icon) ? value.icon : '📄';
    return `${icon} ${value.name[0][0]}`;
  } catch (e) {
    return undefined;
  }
};

export const getLabel = (value: any): string | undefined =>
  getLabelForPage(value) || getLabelForCollectionPage(value);

export const asSearchItem =
  (name: string, domain: string, id: string, label: string, sdk: SDK) => {
    const url = `${serviceDomain}/${domain}/${id}`;

    const resultItemBase = {
      resourceId: id,
      category: `${serviceName}: ${name}`,
      manifestURL: sdk.activity.id,
      label,
      imgUrl: logo,
      url,
    };

    return {
      ...resultItemBase,
      onSelect: () => {
        const targetTab = sdk.tabs.getTabs().find(t => id === idExtractor(t.url));
        if (targetTab) {
          return sdk.tabs.navToTab(targetTab.tabId);
        }
        const applicationId = sdk.tabs.getTabs()[0].applicationId; // this line assume there is always 1 tab for notion app
        return sdk.tabs.create({ url, applicationId });
      },
    };
  };
