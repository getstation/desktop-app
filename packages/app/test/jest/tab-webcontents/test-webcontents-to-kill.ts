import * as Immutable from 'immutable';
import { tabWebcontentsToKill } from '../../../src/tab-webcontents/api';
import { applications, manifests, appSettings, tabs, tabWebcontents } from './webcontents-to-kill-data';

describe('webcontents to kill', () => {
  it('should kill the oldest loaded tabs', () => {
    const results = tabWebcontentsToKill(
      Immutable.fromJS(applications),
      Immutable.fromJS(appSettings),
      Immutable.fromJS(tabWebcontents),
      manifests,
      Immutable.fromJS(tabs),
      []
    );

    // @ts-ignore: no iterator declaration
    const tabsIds = results.map(([tabId]) => tabId).toJS();

    const expectedTabIds = [
      'slite-r1qAypUff/HyYuQK9WQ',
      'slite-r1qAypUff/rkISut8ZQ',
      'slite-r1qAypUff/BkT4QIypf',
      'slite-r1qAypUff/SytooADzX',
      'slite-r1qAypUff/B1AWOW3k7',
    ];

    expect(tabsIds).toEqual(expect.arrayContaining(expectedTabIds));
    expect(tabsIds).toHaveLength(expectedTabIds.length);
  });
});
