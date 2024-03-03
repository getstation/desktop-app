import * as React from 'react';
import { createUseStyles } from 'react-jss';
import * as classNames from 'classnames';
import { flowRight as compose } from 'lodash';
import withBurgerMenuStatus, { WithBurgerMenuStatus } from '@src/HOC/withBurgerMenuStatus';
import { screenHash, screenNames } from '@src/shared/constants/constants';
import { ContextEnvPlatform } from '@src/app';
import AppStoreAsideNavRouterMenu
  from '@src/components/AppStoreAside/AppStoreAsideNav/AppStoreAsideNavRouterMenu/AppStoreAsideNavRouterMenu';
import { colors } from '@src/theme';

export interface AppStoreAsideNavProps extends WithBurgerMenuStatus {
  appStoreContext: number,
}

interface IClasses {
  nav: string,
  divider: string,
  spacer: string,
  navContainer?: string,
}

const useStyles = createUseStyles({
  nav: {
    visibility: 'visible',
    height: 'auto',
    backgroundColor: colors.blueGray30,
    marginTop: 0,
    zIndex: 100,
  },
  divider: {
    width: 'auto',
    height: 1,
    backgroundColor: colors.dividerColor,
    opacity: 0.46,
    margin: '23px 30px 30px',
  },
  spacer: {
    width: 'auto',
    height: 1,
    opacity: 0,
    margin: [12, 0],
  },
  '@media (max-width: 599px)': {
    nav: {
      width: '100%',
      visibility: 'hidden',
      backgroundColor: colors.blueGray40,
      maxHeight: 0,
      position: 'absolute',
      top: '60px',
      left: '0',
      overflow: 'hidden',
      transitionDuration: '.5s',
      transitionProperty: 'visibility, max-height',
      '&.active-burger': {
        visibility: 'visible',
        maxHeight: '430px',
        transitionDuration: '.5s',
        transitionProperty: 'visibility, max-height',
      },
    },
    navContainer: {
      margin: '25px 0',
    },
  },
  '@media (min-width: 600px)': {
    nav: {
      padding: '23px 0',
    },
    divider: {
      width: 148,

      margin: '0 auto',
      marginTop: 30,
      marginBottom: 23,
    },
  },
});

const AppStoreAsideNav = (
  {
    isBurgerOpen,
    appStoreContext,
  }: AppStoreAsideNavProps,
) => {
  const classes: IClasses = useStyles();

  const discoverMenuTitle = 'DISCOVER';
  const myStationMenuTitle = 'MY STATION';

  const discoverNavMenuList = [
    {
      screenName: screenNames.mostPopulars,
      title: 'Most popular',
      iconName: '#i--hot',
      hash: screenHash.MOST_POPULAR,
    },
    {
      screenName: screenNames.allApps,
      title: 'All apps',
      iconName: '#i--categories',
      hash: screenHash.ALL_APPS,
    },
    {
      screenName: screenNames.allExtensions,
      title: 'All extensions',
      iconName: '#i--extensions',
      hash: screenHash.ALL_EXTENSIONS,
    },
  ];

  const myStationNavMenuList = [
    {
      screenName: screenNames.myCustomApps,
      title: 'My custom apps',
      iconName: '#i--edit',
      hash: screenHash.MY_CUSTOM_APPS,
    },
  ];

  const discoverList = [...discoverNavMenuList];

  return (
    <nav
      className={classNames(
        classes!.nav,
        { 'active-burger': isBurgerOpen }
      )}
    >
      <div className={classes!.navContainer}>
        <AppStoreAsideNavRouterMenu
          navMenuTitle={discoverMenuTitle}
          navMenuList={discoverList}
          appStoreContext={appStoreContext}
          link={'/'}
        />
        {appStoreContext !== ContextEnvPlatform.Browser &&
          <AppStoreAsideNavRouterMenu
            navMenuTitle={myStationMenuTitle}
            navMenuList={myStationNavMenuList}
            link={'/'}
          />
        }
      </div>
    </nav>
  );
};

export default compose(withBurgerMenuStatus)(AppStoreAsideNav);
