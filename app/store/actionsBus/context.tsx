import * as React from 'react';
import { ActionsBus } from './types';

/*
 ** React Context API for actionsBus: https://reactjs.org/docs/context.html
*/
export const ActionsBusReactContext = React.createContext<{
  actionsBus: ActionsBus | null,
}>({
  actionsBus: null,
});

// helper
type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export interface InjectedProps {
  actionsBus: ActionsBus | null
}
export const withActionsBus = () =>
  <P extends InjectedProps>(WrappedComponent: React.ComponentType<P>):
    React.ComponentType<Omit<P, 'actionsBus'>> => {

    type HOCProps = Omit<P, 'actionsBus'>;

    class WithActionsBus extends React.Component<HOCProps, {}> {
      static displayName = `WithActionsBus(${WrappedComponent.displayName || WrappedComponent.name})`;

      render() {
        return (
          <ActionsBusReactContext.Consumer>
            {
            ({ actionsBus }: { actionsBus: ActionsBus }) => (
              // having the typing of `this.props` correct is difficult
              <WrappedComponent actionsBus={actionsBus} {...this.props as any} />
            )}
          </ActionsBusReactContext.Consumer>
        );
      }
    }

    return WithActionsBus;
  };
