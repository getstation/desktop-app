import * as remote from '@electron/remote';
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
import { ElectronIpcRendererDuplex } from '../utils/stream-ipc-proxy';
import observers from '../observers/index.renderer';
import rootReducer from '../reducers';
import { StationState } from '../types';
import { isPackaged } from '../utils/env';
import { namespace } from './const';
import { createActionsBusMiddleware, ActionsEmitter } from './actionsBus';

export default async function configureStore(actionsEmitter?: ActionsEmitter): Promise<Store> {
  const workerWebContentsId = remote.getGlobal('worker').webContentsId;
  console.log(`[DEBUG] configureStore.client: Creating duplex to worker wcId=${workerWebContentsId}, namespace=${namespace}`);
  const duplex = new ElectronIpcRendererDuplex(workerWebContentsId, namespace);

  const { forwardToServer, getInitialStateClient, replayActionClient } = client(duplex, namespace);

  // Add timeout for initial state to prevent infinite loading
  const timeoutMs = 30000; // 30 seconds
  const initialStatePromise = getInitialStateClient();
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout waiting for initial state after ${timeoutMs}ms. Worker may not be ready.`));
    }, timeoutMs);
  });

  let initialState;
  try {
    initialState = await Promise.race([initialStatePromise, timeoutPromise]);
  } catch (error) {
    console.error('Failed to get initial state:', error);
    // Retry once after a short delay
    console.log('Retrying initial state fetch...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    initialState = await getInitialStateClient();
  }

  let composeEnhancers = compose;
  if (!isPackaged) {
    // const { composeWithDevTools } = require('remote-redux-devtools'); // eslint-disable-line global-require
    // composeEnhancers = composeWithDevTools({
    //   realtime: true,
    //   trace: true,
    //   name: `renderer webContentsId=${remote.getCurrentWebContents().id}`,
    //   port: 8000,
    // });
    composeEnhancers = compose;
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
