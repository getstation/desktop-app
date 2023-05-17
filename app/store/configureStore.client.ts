//import { remote } from 'electron';
import { getGlobal as remoteGetGlobal, getCurrentWebContents as remoteGetCurrentWebContents } from '@electron/remote';
import { compact } from 'ramda-adjunct';
import * as Immutable from 'immutable';
// @ts-ignore: no declaration file
import * as installDevTools from 'immutable-devtools';
import { applyMiddleware, compose, createStore, Store } from 'redux';
// @ts-ignore: no declaration file
import { observe } from 'redux-observers';
import thunk from 'redux-thunk';
// @ts-ignore: no declaration file
import { client } from 'shared-redux';
import { ElectronIpcRendererDuplex } from 'stream-electron-ipc';
import observers from '../observers/index.renderer';
import rootReducer from '../reducers';
import { StationState } from '../types';
import { isPackaged } from '../utils/env';
import { namespace } from './const';
import { createActionsBusMiddleware, ActionsEmitter } from './actionsBus';

export default async function configureStore(actionsEmitter?: ActionsEmitter): Promise<Store> {
  const workerWebContentsId = remoteGetGlobal('worker').webContentsId;
  const duplex = new ElectronIpcRendererDuplex(workerWebContentsId, namespace);

  const { forwardToServer, getInitialStateClient, replayActionClient } = client(duplex, namespace);

  const initialState = await getInitialStateClient();

  let composeEnhancers = compose;
  if (!isPackaged) {
    const { composeWithDevTools } = require('remote-redux-devtools'); // eslint-disable-line global-require
    composeEnhancers = composeWithDevTools({
      realtime: true,
      trace: true,
      name: `renderer webContentsId=${remoteGetCurrentWebContents().id}`,
      port: 8000,
    });
  }

  const middlewares = compact([
    forwardToServer,
    actionsEmitter ? createActionsBusMiddleware(actionsEmitter) : null,
    thunk,
  ]);

  if (process.env.STATION_REDUX_LOGGER) {
    const createLogger = require('redux-logger'); // eslint-disable-line global-require
    const logger = createLogger({
      level: 'info',
      collapsed: true,
      stateTransformer: (state: StationState) => {
        if (Immutable.Iterable.isIterable(state)) return state.toJS();
        return state;
      },
    });
    middlewares.push(logger);
  }

  // Custom formatter for Immutable log output
  // In Dev Tools, press F1 to load the Settings.
  // Scroll down to the Console section and tick "Enable custom formatters".
  installDevTools(Immutable);

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
  );

  const store = createStore(rootReducer, initialState, enhancer);

  if (!isPackaged && module.hot) {
    module.hot.accept(() =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  observe(store, observers, { skipInitialCall: false });

  replayActionClient(store);

  return store;
}
