import { history } from '@getstation/sdk';
import { SearchSection } from 'app/sdk/search/types';
import { Transformer } from 'app/utils/fp';
import memoizee = require('memoizee');

export const historyItemsAsLastUsedSection: Transformer<history.HistoryEntry[], SearchSection> = memoizee(
  (items: history.HistoryEntry[]) => ({ sectionName: 'Last Used', results: items })
);
