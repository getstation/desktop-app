import * as React from 'react';
import { Omit } from '../types';
import bxSDK, { BxSDK } from './index';

export interface InjectedProps {
  sdk: BxSDK,
}

export const withSDK = () =>
  <P extends InjectedProps>(WrappedComponent: React.ComponentType<P>):
    React.ComponentClass<Omit<P, keyof InjectedProps>> => {

    return class WithSDK extends React.Component<Omit<P, keyof InjectedProps>, {}> {
      static displayName = `WithSDK(${WrappedComponent.displayName || WrappedComponent.name})`;

      render() {
        return (
          <WrappedComponent {...this.props} sdk={bxSDK} />
        );
      }
    };
  };
