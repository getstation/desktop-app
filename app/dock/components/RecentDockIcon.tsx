import { Icon, IconSymbol, ThemeTypes } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import classNames = require('classnames');
import AppIcon from './AppIcon';
import { ActivityEntry } from '../../activity/queries@local.gql.generated';

interface Classes {
  container: string,
  recentApplicationIcon: string,
  recentApplicationArrow: string,
  hoverIcon: string,
}

interface Props {
  classes?: Classes,
  onMouseEnter: () => any,
  onMouseLeave: () => any,
  onClickIcon: () => any,
  recentApplication: ActivityEntry,
  innerRef?: (ref: HTMLElement | null) => void;
}

const styles = (theme: ThemeTypes) => ({
  container: {
    ...theme.mixins.size(25),
    position: 'relative',
    margin: '12px auto 8px',
    borderRadius: 100,
    opacity: 0.6,
    filter: 'grayscale(60%)',
    transition: '300ms',
    '&:hover': {
      opacity: 1,
      filter: 'grayscale(20%)',
    },
    '&:hover $hoverIcon': {
      opacity: 1,
    },
    '&:hover $recentApplicationArrow': {
      opacity: 1,
    },
  },
  recentApplicationIcon: {
    ...theme.mixins.size(25),
    borderRadius: 100,
    transition: 'filter 300ms cubic-bezier(0.37, 1.21, 0.89, 0.87)',
  },
  recentApplicationArrow: {
    ...theme.mixins.size(33),
    borderRadius: 100,
    position: 'absolute',
    top: -6,
    left: -7,
    opacity: .6,
  },
  hoverIcon: {
    ...theme.mixins.size('100%'),
    ...theme.mixins.flexbox.containerCenter,
    position: 'absolute',
    top: 0,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    opacity: 0,
    transition: 'opacity 300ms cubic-bezier(0.37, 1.21, 0.89, 0.87)',
    cursor: 'pointer',
  },
});

@injectSheet(styles)
export default class RecentDockIcon extends React.PureComponent<Props, {}> {
  render() {
    const { classes, recentApplication, onMouseEnter, onMouseLeave, onClickIcon, innerRef } = this.props;

    return (
      <div
        ref={innerRef}
        className={classNames(classes!.container, 'appcues-subdock-recent')}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClickIcon}
      >
        {recentApplication &&
          <>
            <AppIcon
              size={25}
              imgUrl={recentApplication.imgUrl!}
              themeColor={recentApplication.themeColor!}
            />
          </>
        }

        <Icon className={classes!.recentApplicationArrow} symbolId={IconSymbol.RECENT_ARROW} size={33} color={'#FFF'} />
      </div>
    );
  }
}
