import { ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  container: string,
  dot: string,
  close: string,
  minimize: string,
  expand: string,
}

interface Props {
  classes?: Classes,
  focused: boolean,
  handleClose: () => any,
  handleMinimize: () => any,
  handleExpand: () => any,
  dark?: boolean,
  allHover?: boolean,
}

@injectSheet((theme: ThemeTypes) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: '0 0 auto',
    padding: 6,
    paddingBottom: 4,
    width: 50,
  },
  dot: {
    ...theme.avatarMixin('10px'),
    backgroundColor: ({ dark }: Props) => dark ? `#000` : `#FFF`,
    opacity: ({ focused, allHover }: Props) => allHover ? 1 : (focused ? 0.5 : 0.2),
    flex: '0 0 auto',
    transition: 'all 100ms ease-out',
    '&:hover': {
      opacity: 1,
    },
  },
  close: {
    backgroundColor: ({ allHover }: Props) => allHover ? '#FF6059' : 'parent',
    '&:hover': {
      backgroundColor: '#FF6059',
    },
  },
  minimize: {
    backgroundColor: ({ allHover }: Props) => allHover ? '#FFBD2E' : 'parent',
    '&:hover': {
      backgroundColor: '#FFBD2E',
    },
  },
  expand: {
    backgroundColor: ({ allHover }: Props) => allHover ? '#29C941' : 'parent',
    '&:hover': {
      backgroundColor: '#29C941',
    },
  },
}))
export default class TrafficLights extends React.PureComponent<Props, {}> {
  render() {
    const { classes, handleClose, handleMinimize, handleExpand } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classNames(classes!.dot, classes!.close)} onClick={handleClose} />
        <div className={classNames(classes!.dot, classes!.minimize)} onClick={handleMinimize} />
        <div className={classNames(classes!.dot, classes!.expand)} onClick={handleExpand} />
      </div>
    );
  }
}
