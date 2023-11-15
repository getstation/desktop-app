import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import App from './app';
import rootReducer from './reducers';
import rootSaga from './sagas';
import { State } from './state';

const sagaMiddleware = createSagaMiddleware();
const store: Store<State> = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

// for debug purpose, gives a way to easily access the store
// @ts-ignore : global
window.appStore = store;

const renderRoot = (app: JSX.Element) => {
  ReactDOM.render(app, document.getElementById('root'));
};

if (process.env.NODE_ENV === 'production') {
  renderRoot((
    <Provider store={store}>
        <App />
    </Provider>
  ));
} else { // removed in production, hot-reload config
  renderRoot((
    <Provider store={store}>
      <App />
    </Provider>
  ));

  if (module.hot) {
    // app
    module.hot.accept('./app', async () => {
      // const NextApp = require('./app');
      const NextApp = (await import('./app'));
      renderRoot((
        <HotContainer>
          <Provider store={store}>
            <NextApp />
          </Provider>
        </HotContainer>
      ));
    });

    // reducers
    module.hot.accept('./reducers', () => {
      const newRootReducer = require('./reducers');
      store.replaceReducer(newRootReducer);
    });

    // // epics
    // module.hot.accept('../modules/root-epic', () => {
    //   const newRootEpic = require('./root-epic').default;
    //   epicMiddleware.replaceEpic(newRootEpic);
    // });
  }
}
