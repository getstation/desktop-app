const getInTabSearchForTab = (state, tabId) =>
  state.get('inTabSearch').get(tabId);

export const isSearchActiveForTab = (state, tabId) => {
  const s = getInTabSearchForTab(state, tabId);
  return s ? s.get('active', false) : false;
};

export const getSearchStringForTab = (state, tabId) => {
  const s = getInTabSearchForTab(state, tabId);
  return s ? s.get('searchString', '') : '';
};

export const getSearchResultsInfoForTab = (state, tabId) => {
  const s = getInTabSearchForTab(state, tabId);
  if (!s) return null;

  const results = s.get('results');
  if (!results) return null;

  return {
    activeMatchOrdinal: results.get('activeMatchOrdinal'),
    matchesCount: results.get('matchesCount')
  };
};

export const getSearchActiveFocusForTab = (state, tabId) => {
  const s = getInTabSearchForTab(state, tabId);
  if (!s) return null;

  return s.get('activeFocus');
}
