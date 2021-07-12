import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
}

export interface Props {
  classes?: Classes,
  children: React.ReactNode,
}

const styles = () => ({
  container: {
    position: 'relative',
    height: '88vh',
    padding: 20,
    border: '2px solid black',
    borderRadius: 3,
    overflow: 'hidden',
  },
});

@injectSheet(styles)
export default class Container extends React.PureComponent<Props, {}> {
  render() {
    const { classes, children } = this.props;

    return (
      <div id="storybook-portal" className={classes!.container}>
        {children}
      </div>
    );
  }
}
