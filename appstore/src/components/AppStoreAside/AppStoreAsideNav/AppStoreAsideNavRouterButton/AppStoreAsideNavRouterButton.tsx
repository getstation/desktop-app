import {
  useAppStoreAsideNavButtonOnClick,
} from '@src/components/AppStoreAside/AppStoreAsideNav/AppStoreAsideNavButton/customHooks';
import * as React from 'react';
import AppStoreAsideNavButton, { AppStoreAsideButtonProps } from
    '@src/components/AppStoreAside/AppStoreAsideNav/AppStoreAsideNavButton/AppStoreAsideNavButton';
import { Link, useLocation } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { flowRight as compose } from 'lodash';
import withSearchString, { WithSearchStringProps } from '@src/HOC/withSearchString';
import withCustomAppRequestMode, { WithCustomAppRequestModeStatus } from '@src/HOC/withCustomAppRequestMode';
import withBurgerMenuStatus, { WithBurgerMenuStatus } from '@src/HOC/withBurgerMenuStatus';

const useStyles = createUseStyles({
  link: {
    textDecoration: 'none',
  },
});

type AppStoreAsideNavRouterButton = {
  link: string,
  hash?: string,
} & AppStoreAsideButtonProps
  & WithSearchStringProps
  & WithCustomAppRequestModeStatus
  & WithBurgerMenuStatus;

const AppStoreAsideNavRouterButton = (props: AppStoreAsideNavRouterButton) => {
  const classes = useStyles();
  const location = useLocation();

  const [isActive, setIsActive] = React.useState(false);

  const { appRequestIsOpen, isEnterPressed } = props;

  React.useEffect(() => {
    setIsActive(
      !appRequestIsOpen &&
      !isEnterPressed &&
      location.hash === props.hash &&
      location.pathname === props.link
    );
  }, [location, appRequestIsOpen, isEnterPressed, props.hash]);

  const isBurgerOpen = props.isBurgerOpen || false;
  const onClick = useAppStoreAsideNavButtonOnClick();

  return (
    <Link
      to={{
        pathname: props.link,
        hash: props.hash,
      }}
      className={classes.link}
    >
      <AppStoreAsideNavButton
        {...props}
        isBurgerOpen={isBurgerOpen}
        isActive={isActive}
        onClick={onClick}
      />
    </Link>
  );
};

export default compose(
  withSearchString,
  withCustomAppRequestMode,
  withBurgerMenuStatus,
)(AppStoreAsideNavRouterButton);
