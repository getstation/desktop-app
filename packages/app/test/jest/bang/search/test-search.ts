import * as ms from 'ms';
import * as sinon from 'sinon';
import { SearchResultSerialized } from '../../../../src/bang/duck';
import { createFakeSearchEngine } from './utils/fake-search-engine';
import {
  SearchResultFixture,
  contextualFrecencyData,
  case1,
  case2,
  case3and4,
  case5,
  case6,
  case7
} from './fixtures';
import { SearchEngine } from '../../../../src/bang/search/types';

const noop = () => {};

const getLabel = (item: SearchResultSerialized) =>
  `${item.category} - ${item.label} (${item.context || ''})`;

const loggers = {
  // fuseLogger: console.log,
  // contextualFrecencyLogger: console.log,
  fuseLogger: noop,
  contextualFrecencyLogger: noop,
  globalFrecencyLogger: noop
};

/*
 ** The different cases can be found here:
 ** https://www.notion.so/stationhq/Irrelevant-Quick-Switch-Results-61005b6543ed4a4aa9de472dfd4e418b
 */

describe('bang:search', () => {
  const dateFrecencyData = 1543503589172; // means all frecency entry will have a high frecency score
  const now = dateFrecencyData + ms('15 day');
  const dateStub = sinon.stub(Date, 'now').returns(dateFrecencyData);

  let searchEngine: SearchEngine;

  const resetSearchEngine = () => {
    dateStub.returns(dateFrecencyData);
    searchEngine = createFakeSearchEngine(contextualFrecencyData, loggers);
  };

  beforeEach(() => {
    resetSearchEngine();
  });

  afterAll(() => {
    dateStub.restore();
  });

  const search = (fixture: SearchResultFixture, limit: number = 1) => {
    return searchEngine.search(
      fixture.searchResults,
      { query: fixture.queryValue },
      limit
    );
  };

  const searchLabels = (fixture: SearchResultFixture, limit?: number) => {
    return search(fixture, limit).map(getLabel);
  };

  describe('case 1 (first letter relevancy + frecency)', () => {
    test('[with frecency stimulation] right results with the first letter (i)', () => {
      searchEngine.saveContextualSelection({
        selectedId: 'intercom-TvMw_V2qR/rDusJIprfe',
        searchQuery: 'intercom'
      });
      expect(searchLabels(case1.i, 1)).toMatchInlineSnapshot(`
                Array [
                  "Apps - Intercom ()",
                ]
            `);
    });

    test('right results with the first letter (i)', () => {
      expect(searchLabels(case1.i, 3)).toMatchInlineSnapshot(`
                        Array [
                          "Apps - Intercom ()",
                          "Apps - Invision ()",
                          "Intercom - Intercom | The easiest way to see and talk to your users ()",
                        ]
                  `);
    });

    test('right results with the first letter (s)', () => {
      expect(searchLabels(case1.s, 3)).toMatchInlineSnapshot(`
                        Array [
                          "Apps - Slack (ycfounders.slack.com)",
                          "Apps - Spendesk ()",
                          "Apps - Station Community ()",
                        ]
                  `);
    });
  });

  describe('case 2 (corrects results relevancy all the while typing)', () => {
    test('spendesk', () => {
      expect([
        searchLabels(case2.s),
        searchLabels(case2.sp),
        searchLabels(case2.spe),
        searchLabels(case2.spen)
      ]).toMatchInlineSnapshot(`
                        Array [
                          Array [
                            "Apps - Slack (ycfounders.slack.com)",
                          ],
                          Array [
                            "Apps - Spendesk ()",
                          ],
                          Array [
                            "Apps - Spendesk ()",
                          ],
                          Array [
                            "Apps - Spendesk ()",
                          ],
                        ]
                  `);
    });

    test('agora pulse (first results)', () => {
      expect([
        searchLabels(case2.a),
        searchLabels(case2.ag),
        searchLabels(case2.ago),
        searchLabels(case2.agor)
      ]).toMatchInlineSnapshot(`
                        Array [
                          Array [
                            "Apps - Agora Pulse ()",
                          ],
                          Array [
                            "Apps - Agora Pulse ()",
                          ],
                          Array [
                            "Apps - Agora Pulse ()",
                          ],
                          Array [
                            "Apps - Agora Pulse ()",
                          ],
                        ]
                  `);
    });

    test('agora pulse (with alexandre in global frecency data)', () => {
      const alexUserId = 'U911ZTW6Q';
      searchEngine.saveGlobalSelection(alexUserId, new Date());

      expect([
        searchLabels(case2.a),
        searchLabels(case2.ag),
        searchLabels(case2.ago),
        searchLabels(case2.agor)
      ]).toMatchInlineSnapshot(`
        Array [
          Array [
            "Slack: Station - Alexandre Lachèze (Slack > Station)",
          ],
          Array [
            "Apps - Agora Pulse ()",
          ],
          Array [
            "Apps - Agora Pulse ()",
          ],
          Array [
            "Apps - Agora Pulse ()",
          ],
        ]
      `);
    });
  });

  describe('case 3 and 4 (frecency first results)', () => {
    test('alexandre', () => {
      expect([
        searchLabels(case3and4.alex),
        searchLabels(case3and4.alexa),
        searchLabels(case3and4.alexan),
        searchLabels(case3and4.alexand),
        searchLabels(case3and4.alexandr),
        searchLabels(case3and4.alexandre)
      ]).toMatchInlineSnapshot(`
                        Array [
                          Array [
                            "Slack: Station - Alexandre Lachèze (Slack > Station)",
                          ],
                          Array [
                            "Slack: Station - Alexandre Lachèze (Slack > Station)",
                          ],
                          Array [
                            "Slack: Station - Alexandre Lachèze (Slack > Station)",
                          ],
                          Array [
                            "Slack: Station - Alexandre Lachèze (Slack > Station)",
                          ],
                          Array [
                            "Slack: Station - Alexandre Lachèze (Slack > Station)",
                          ],
                          Array [
                            "Slack: Station - Alexandre Lachèze (Slack > Station)",
                          ],
                        ]
                  `);
    });

    // "expired frecency data" is synonym to: "no frecency data" in term of computation
    test('[expired frecency data] - alexandre', () => {
      resetSearchEngine();
      dateStub.returns(now);

      expect([
        searchLabels(case3and4.alex),
        searchLabels(case3and4.alexa),
        searchLabels(case3and4.alexan),
        searchLabels(case3and4.alexand),
        searchLabels(case3and4.alexandr),
        searchLabels(case3and4.alexandre)
      ]).toMatchInlineSnapshot(`
        Array [
          Array [
            "Slack: Station - Alexandre Lachèze (Slack > Station)",
          ],
          Array [
            "Slack: YC Founders - Alexa (Slack > YC Founders)",
          ],
          Array [
            "Slack: Station - Alexandre Lachèze (Slack > Station)",
          ],
          Array [
            "Slack: Station - Alexandre Lachèze (Slack > Station)",
          ],
          Array [
            "Slack: Station - Alexandre Lachèze (Slack > Station)",
          ],
          Array [
            "Slack: The Network - Alexandre (Slack > The Network)",
          ],
        ]
      `);
    });
  });

  describe('case 5 (entire name of a contact)', () => {
    test('hugo', () => {
      expect([searchLabels(case5.hug), searchLabels(case5.hugo)])
        .toMatchInlineSnapshot(`
                        Array [
                          Array [
                            "Slack: Station - Hugo Mano (Slack > Station)",
                          ],
                          Array [
                            "Slack: Station - Hugo Mano (Slack > Station)",
                          ],
                        ]
                  `);
    });

    // "expired frecency data" is synonym to: "no frecency data" in term of computation
    test('[expired frecency data] hugo', () => {
      dateStub.returns(now);
      expect([searchLabels(case5.hug), searchLabels(case5.hugo)])
        .toMatchInlineSnapshot(`
                        Array [
                          Array [
                            "Slack: Station - Hugo Mano (Slack > Station)",
                          ],
                          Array [
                            "Google Drive - julien@getstation.com - Hugo (julien@getstation.com)",
                          ],
                        ]
                  `);
    });
  });

  describe('case 6 (3-4 letters relevant first result)', () => {
    test('investors', () => {
      expect(searchLabels(case6.inves)).toMatchInlineSnapshot(`
                        Array [
                          "YC Bookface - Investments | Bookface ()",
                        ]
                  `);
    });

    test('todoist (relevancy only)', () => {
      expect(searchLabels(case6.tod)).toMatchInlineSnapshot(`
                        Array [
                          "Apps - Todoist ()",
                        ]
                  `);
    });
  });

  describe('case 7 (rst result relevancy)', () => {
    test('ats b', () => {
      expect(searchLabels(case7.ats_b)).toMatchInlineSnapshot(`
                        Array [
                          "Notion: Station - 📄 ATS benchmark ()",
                        ]
                  `);
    });
  });
});
