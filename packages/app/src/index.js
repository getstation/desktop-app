/* eslint-disable global-require, import/first */
import './utils/stat-cache';
import './dotenv';
import { webFrame, ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { BrowserXThemeProvider } from '@getstation/theme';
import './theme/css/app.global.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import { handleError } from './services/api/helpers';
import configureStore from './store/configureStore.client';
import ReduxBasedGradientProvider from './theme/ReduxBasedGradientProvider';
import { getGQlClient } from './utils/graphql';
import ConsoleErrorBoundary from './common/containers/ConsoleErrorBoundary';

import { ActionsBusReactContext, createActionsEmitter, createActionsBus } from './store/actionsBus';

import { BxNotification } from './notification-center/webview-preload';

window.Notification = BxNotification;

// prevent app pinch zomming
webFrame.setVisualZoomLevelLimits(1, 1);

if (process.env.STATION_REACT_PERF) {
  const Perf = require('react-addons-perf'); // eslint-disable-line global-require
  window.Perf = Perf;
  // use like this:
  // Perf.start() and then Perf.stop()
  // Perf.printWasted()
}

const apolloClient = getGQlClient();

const actionsEmitter = createActionsEmitter();
const actionsBus = createActionsBus(actionsEmitter);

configureStore(actionsEmitter)
  .then(store => {
    // for debug purpose, gives us a way to easily access the store
    window.stationStore = store;

    render(store);

    return null;
  })
  .catch(handleError());

const render = (store) => {
  const App = require('./containers/App').default; // eslint-disable-line global-require

  ReactDOM.render(
    <Provider store={store}>
      <ActionsBusReactContext.Provider value={{ actionsBus }}>
        <ApolloProvider client={apolloClient}>
          <ApolloHooksProvider client={apolloClient}>
            <BrowserXThemeProvider>
              <ReduxBasedGradientProvider>
                <ConsoleErrorBoundary>
                  <App />
                </ConsoleErrorBoundary>
              </ReduxBasedGradientProvider>
            </BrowserXThemeProvider>
          </ApolloHooksProvider>
        </ApolloProvider>
      </ActionsBusReactContext.Provider>
    </Provider>,
    document.getElementById('root')
  );

  ipcRenderer.send('bx-ready-to-show');
};

if (module.hot) {
  module.hot.accept();
}
