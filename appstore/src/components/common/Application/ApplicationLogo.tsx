import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { theme, Icon, IconSymbol } from '@getstation/theme';

const useStyles = createUseStyles({
  iconContainer: {
    margin: '0 10px 0 0',
    position: 'relative',
    width: 30,
    minWidth: 30,
    height: 30,
    backgroundColor: ({ applicationThemeColor }: Props) => applicationThemeColor,
    borderRadius: '50%',
    overflow: ({ applicationIsExtension }: Props) => applicationIsExtension ? 'visible' : 'hidden',
  },
  icon: {
    display: 'inline-block',
    width: 30,
    height: 30,
  },
  iconPin: {
    ...theme.mixins.flexbox.containerCenter,
    position: 'absolute',
    bottom: -6,
    right: -7,
    ...theme.mixins.size(22),
    backgroundColor: '#BBB',
    border: '2px solid white',
    borderRadius: '100%',
  },
});

type Props = {
  applicationIconURL: string,
  applicationThemeColor: string,
  applicationIsExtension: boolean,
};

const ApplicationLogo = ({
  applicationIconURL,
  applicationThemeColor,
  applicationIsExtension,
}: Props) => {
  const classes = useStyles({ applicationThemeColor });

  return (
    <div className={classes!.iconContainer}>
      {applicationIconURL ?
        <svg className={classes!.icon}>
          <image xlinkHref={`${applicationIconURL}`} width={30} height={30} className={classes!.icon} />
        </svg>
        :
        <Icon symbolId={IconSymbol.APP_ICON_PLACEHOLDER} size={22} />
      }

      {
        applicationIsExtension &&
        <div className={classes!.iconPin}>
          <Icon symbolId={IconSymbol.EXTENSION} size={25} color={'#5d5d5d'} />
        </div>
      }
    </div>
  );
};

export default ApplicationLogo;
