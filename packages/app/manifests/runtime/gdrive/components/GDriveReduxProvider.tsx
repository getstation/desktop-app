import { SDK } from '@getstation/sdk';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { State } from '../types';
import GDriveSearchSettings from './GDriveSearchSettings';

export function getReactTree(sdk: SDK, store: Store<State>) {
  return class GDriveReduxProvider extends React.PureComponent {
    render() {
      return (
        <Provider store={store}>
          <GDriveSearchSettings
            sdk={sdk}
          />
        </Provider>
      );
    }
  };
}
