# Bang Lifecycle

- Search value is submit via [BangInput](https://github.com/getstation/desktop-app/blob/master/app/bang/components/BangInput.tsx)
- Keyboard input dispatch [`SET_SEARCH_VALUE`](https://github.com/getstation/desktop-app/blob/master/app/bang/duck.ts\#L64) action
- The action trigger [`sdkQueryValueEmitter`](https://github.com/getstation/desktop-app/blob/master/app/bang/sagas.ts\#L63) saga effect for push search value in their consumers with [SearchProvider.query](https://github.com/getstation/desktop-app/blob/master/app/sdk/search/SearchProvider.ts\#L60)
- The forked [`sdkSearchProvider`](https://github.com/getstation/desktop-app/blob/master/app/bang/sagas.ts#L97) effect (run in background) transform `results` and `query` RxJS subscriptions into a Saga events source using [channels](https://redux-saga.js.org/docs/advanced/Channels.html)
  - Each time that results are received, we send them into [`produceResults`](https://github.com/getstation/desktop-app/blob/master/app/bang/sagas.ts#L74) for a suit of data manipulations:
    - [Serialization](https://github.com/getstation/desktop-app/blob/master/app/bang/api.ts#L34): the plugin and saga middleware is in the main, the results are displayed in the renderer so we need to store callbacks and serialize results
    - [Build Top-Hits](https://github.com/getstation/desktop-app/blob/master/app/bang/search.ts#L10): with [fuse and frecency](https://github.com/getstation/desktop-app/blob/master/app/bang/search/score/index.ts#L11) we are able to sort results with relevance
    - [Organize results](https://github.com/getstation/desktop-app/blob/master/app/bang/helpers/organizeSearchResults.ts#L114)
  - Organized results are dispatched with `SET_SEARCH_RESULTS` action
  - Dispatching a SET_SEARCH_RESULTS action will update state.bang.results
  - Modifying state.bang.results will trigger a rerender of the [BangList](https://github.com/getstation/desktop-app/blob/master/app/bang/components/BangList.tsx#L320) component
