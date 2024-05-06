import * as React from 'react';
import { createUseStyles } from 'react-jss';
import * as classNames from 'classnames';

import styles from './styles';
const asideSvgSpitePath: string = require('../../aside-svg-spite.svg');

const useStyles = createUseStyles(styles);

export type AppStoreAsideButtonProps = {
  title: string,
  iconName: string,
  screenName: string,
};

export type AppStoreAsideNavButtonProps = {
  isActive: boolean,
  onClick: () => void,
  isBurgerOpen: boolean,
}
  & AppStoreAsideButtonProps;

const AppStoreAsideNavButton = (props: AppStoreAsideNavButtonProps) => {
  const { onClick, title, iconName, isActive, isBurgerOpen } = props;
  const classes = useStyles();

  return (
    <li
      className={classNames(
        classes.navButton,
        { 'active-burger': isBurgerOpen },
        isActive && classes.activeNavButton
      )}
      onClick={onClick}
    >
      <div className={classes.content}>
        <svg className={classes.icon}>
          <use xlinkHref={`${asideSvgSpitePath}${iconName}`}/>
        </svg>
        <div className={classes.title}>{title}</div>
      </div>
    </li>
  );
};

export default AppStoreAsideNavButton;
