import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';

interface IProps {
  onClick?: () => void,
  children?: any,
}

interface IStateFromProps {
  themeGradient: string
}

// type Props = IProps & IStateFromProps;
type Props = IProps & WithSheet<typeof styles>;

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    ...theme.mixins.flexbox.containerCenter,
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 100,
    border: 0,
    outline: 'none',
    // backgroundImage: (props: Props) => props.themeGradient,
    backgroundColor: 'gray',
    color: 'white',
    boxShadow: '0px 2px 10px 0 rgba(150, 150, 150, 0.75)',
    cursor: 'pointer',
  },
});

export class FloatingActionButtonImpl extends React.PureComponent<Props, {}> {
  render() {
    const { classes, onClick, children } = this.props;

    return (
      <button className={classes.container} onClick={onClick}>
        {children}
      </button>
    );
  }
}

export const FloatingActionButton = injectSheet(styles)(FloatingActionButtonImpl);
