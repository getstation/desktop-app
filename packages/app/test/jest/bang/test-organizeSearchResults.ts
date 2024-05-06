import { SectionKinds } from '../../../src/bang/api';
import { SearchPaneItemSelectedItem } from '../../../src/bang/duck';
import { organizeSearchResults, SearchItem, Section } from '../../../src/bang/helpers/organizeSearchResults';

const organize = organizeSearchResults;

type Options = {
  url: string,
  type: SearchPaneItemSelectedItem,
  sectionKind: SectionKinds,
  onSelect?: boolean,
};

const getDefaultOptions = (id: string): Options => ({
  url: `https://${id}/`,
  type: 'station-app',
  sectionKind: 'app-specific',
});

const createDummyItem = (id: string, options?: Partial<Options>): SearchItem => {
  const defaultOptions = getDefaultOptions(id);
  const { url, type, sectionKind, onSelect }: Options = Object.assign({}, defaultOptions, options);
  return {
    resourceId: id,
    uniqId: `-${id}`,
    url,
    type,
    sectionKind,
    onSelect,
    category: 'dummy category',
    label: 'dummy label',
    context: 'dummy context',
    imgUrl: 'http://dummy-image-url',
  };
};

describe('organizeSearchResults', () => {
  describe('with empty array of sections', () => {
    test('should return empty array of sections', () => {
      const inputData: Section[] = [];
      const expectedData: Section[] = [];
      expect(organize(inputData)).toEqual(expectedData);
    });
  });

  describe('filtering', () => {
    test('should reject loaded sections without results', () => {
      const inputData: Section[] = [
        { sectionKind: 'app-specific', sectionName: '', loading: true, results: [] },
        { sectionKind: 'app-specific', sectionName: '', loading: true },
        { sectionKind: 'app-specific', sectionName: '' },
        { sectionKind: 'app-specific', sectionName: '', loading: false, results: [createDummyItem('1')] },
        // following items should be rejected
        { sectionKind: 'app-specific', sectionName: '', loading: false },
        { sectionKind: 'app-specific', sectionName: '', loading: false, results: [] },
      ];
      const expectedData: Section[] = [
        // loading category with no result shouldn't be rejected
        { sectionKind: 'app-specific', sectionName: '', loading: true, results: [] },
        { sectionKind: 'app-specific', sectionName: '', loading: true, results: [] }, // same here
        { sectionKind: 'app-specific', sectionName: '', results: [] }, // same here
        { sectionKind: 'app-specific', sectionName: '', loading: false, results: [createDummyItem('1')] },
      ];
      expect(organize(inputData)).toEqual(expectedData);
    });
  });

  describe('ordering', () => {
    test('should order sections', () => {
      const inputData: Section[] = [
        { sectionName: '', sectionKind: 'app-specific', loading: false, results: [createDummyItem('dummy1')] },
        { sectionName: '', sectionKind: 'apps', loading: false, results: [createDummyItem('app1')] },
        { sectionName: '', sectionKind: 'app-specific', loading: false, results: [createDummyItem('dummy2')] },
        { sectionName: '', sectionKind: 'apps', loading: false, results: [createDummyItem('app2')] },
        { sectionName: '', sectionKind: 'app-specific', loading: false, results: [createDummyItem('dummy3')] },
        { sectionName: '', sectionKind: 'top-hits', loading: false, results: [createDummyItem('top_hits1')] },
        { sectionName: '', sectionKind: 'top-hits', loading: false, results: [createDummyItem('top_hits2')] },
      ];
      const expectedData: Section[] = [
        { sectionName: '', sectionKind: 'top-hits', loading: false, results: [createDummyItem('top_hits1')] },
        { sectionName: '', sectionKind: 'top-hits', loading: false, results: [createDummyItem('top_hits2')] },
        { sectionName: '', sectionKind: 'apps', loading: false, results: [createDummyItem('app1')] },
        { sectionName: '', sectionKind: 'apps', loading: false, results: [createDummyItem('app2')] },
        { sectionName: '', sectionKind: 'app-specific', loading: false, results: [createDummyItem('dummy1')] },
        { sectionName: '', sectionKind: 'app-specific', loading: false, results: [createDummyItem('dummy2')] },
        { sectionName: '', sectionKind: 'app-specific', loading: false, results: [createDummyItem('dummy3')] },
      ];
      expect(organize(inputData)).toEqual(expectedData);
    });
  });

  describe('deduplication', () => {
    test('should remove duplicates search items between sections', () => {
      const inputData: Section[] = [
        {
          sectionKind: 'app-specific',
          sectionName: '',
          loading: false,
          results: [
            createDummyItem('dummy-1'),
            createDummyItem('dummy-2'),
            createDummyItem('duplicate'),
            createDummyItem('duplicate'),
            createDummyItem('url-duplicate-1', { url: 'http://same-url.com' }),
            createDummyItem('url-duplicate-2', { url: 'http://same-url.com' }),
          ],
        },
        {
          sectionKind: 'app-specific',
          sectionName: '',
          loading: false,
          results: [
            createDummyItem('dummy-1'),
            createDummyItem('dummy-2'),
            createDummyItem('duplicate'),
            createDummyItem('duplicate'),
            createDummyItem('url-duplicate-1', { url: 'http://same-url.com' }),
            createDummyItem('url-duplicate-2', { url: 'http://same-url.com' }),
            createDummyItem('on-select-1', { url: '', onSelect: true }),
            createDummyItem('on-select-2', { url: '', onSelect: true }),
          ],
        },
      ];
      const expectedData: Section[] = [
        {
          sectionKind: 'app-specific',
          sectionName: '',
          loading: false,
          results: [
            createDummyItem('dummy-1'),
            createDummyItem('dummy-2'),
            createDummyItem('duplicate'),
            createDummyItem('url-duplicate-1', { url: 'http://same-url.com' }),
          ],
        },
        {
          sectionKind: 'app-specific',
          sectionName: '',
          loading: false,
          results: [
            createDummyItem('dummy-1'),
            createDummyItem('dummy-2'),
            createDummyItem('duplicate'),
            createDummyItem('url-duplicate-1', { url: 'http://same-url.com' }),
            createDummyItem('on-select-1', { url: '', onSelect: true }),
            createDummyItem('on-select-2', { url: '', onSelect: true }),
          ],
        },
      ];
      expect(organize(inputData)).toEqual(expectedData);
    });
  });

  describe('limit', () => {
    test('should limit number of results for each section to 10', () => {
      const inputData: Section[] = [
        {
          sectionKind: 'app-specific',
          sectionName: '',
          loading: false,
          results: [
            createDummyItem('dummy-1'),
            createDummyItem('dummy-2'),
            createDummyItem('dummy-3'),
            createDummyItem('dummy-4'),
            createDummyItem('dummy-5'),
            createDummyItem('dummy-6'),
            createDummyItem('dummy-7'),
            createDummyItem('dummy-8'),
            createDummyItem('dummy-9'),
            createDummyItem('dummy-10'),
            createDummyItem('dummy-11'),
            createDummyItem('dummy-12'),
          ],
        },
      ];
      const expectedData: Section[] = [
        {
          sectionKind: 'app-specific',
          sectionName: '',
          loading: false,
          results: [
            createDummyItem('dummy-1'),
            createDummyItem('dummy-2'),
            createDummyItem('dummy-3'),
            createDummyItem('dummy-4'),
            createDummyItem('dummy-5'),
            createDummyItem('dummy-6'),
            createDummyItem('dummy-7'),
            createDummyItem('dummy-8'),
            createDummyItem('dummy-9'),
            createDummyItem('dummy-10'),
          ],
        },
      ];
      expect(organize(inputData)).toEqual(expectedData);
    });
  });
});
