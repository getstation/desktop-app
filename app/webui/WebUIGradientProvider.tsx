import { GradientProvider } from '@getstation/theme';
import * as React from 'react';
import { Observable, Subscription } from 'rxjs/Rx';

export type Props = {
  children: any,
  themeColorsObservable: Observable<string[]>,
};

export type State = {
  themeColors: string[],
};

export class WebUIGradientProvider extends React.Component<Props, State> {
  subscription: Subscription;

  constructor(props: Props) {
    super(props);
    this.state = {
      // default theme colors, just in case
      themeColors: ['#2B91BA', '#3794C2', '#4B99CF', '#629FDD'],
    };

    this.subscription = props.themeColorsObservable.subscribe(themeColors => {
      this.setState({ themeColors });
    });
  }

  componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <GradientProvider themeColors={this.state.themeColors}>
        {this.props.children}
      </GradientProvider>
    );
  }
}
