import { ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
}

export interface Props {
  classes?: Classes,
  children: React.ReactNode,
}

const styles = (theme: Theme) => ({
  container: {
    margin: [10, 0],
    padding: 10,
    backgroundColor: '#395167',
  },
});

@injectSheet(styles)
export default class ColoredBg extends React.PureComponent<Props, {}> {
  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes!.container}>
        {children}
      </div>
    );
  }
}
