import AppStorePageHeader from '@src/components/AppStoreContent/AppStorePageHeader/AppStorePageHeader';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import appStorePageHeaderStyles from '@src/components/AppStoreContent/AppStorePageHeader/styles';
import { Icon, IconSymbol } from '@getstation/theme';
import { colors } from '@src/theme';
import { useHistory } from 'react-router-dom';

const useStyles = createUseStyles({
  extend: appStorePageHeaderStyles,
  title: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  '@media (max-width: 599px)': {
    pageHeader: {
      display: 'flex',
    },
  },
  pageHeader: {

  },
  returnButton: {
    minWidth: 125,
    border: `1px solid ${colors.blueGray}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: colors.blueGray10,
    },
  },
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    display: 'flex',
    background: '#fafcfd',
    '& $pageHeader': {
      width: '100%',
    },
  },
  icon: {
    '& path': {
      fill: colors.blueGray100,
    },
  },
});

type OwnProps = {
  title: string,
  subTitle?: string,
  showReturnButton?: boolean,
  onReturn?: () => void,
};

export const FullPageHeader = (
  { title, subTitle, showReturnButton, onReturn }: OwnProps
) => {
  const classes = useStyles();

  return (
    <div className={classes!.wrapper}>
      {
        // todo: add LeaveConfirmationModal instead raw
        showReturnButton ? (
          <span className={classes.returnButton} onClick={onReturn}>
            <Icon
              className={classes.icon}
              symbolId={IconSymbol.ARROW_BACK}
              size={38}
            />
          </span>
        ) : null
      }
      <AppStorePageHeader
        // @ts-ignore: styles extend via JSS doesn't affect TS interface
        classes={classes}
        title={title}
        subTitle={subTitle || ''}
      />
    </div>
  );
};
