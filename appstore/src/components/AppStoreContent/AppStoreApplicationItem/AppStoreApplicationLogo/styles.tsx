import { ThemeTypes } from '@getstation/theme';
import * as isBlank from 'is-blank';

import { AppStoreApplicationLogoProps } from './AppStoreApplicationLogo';

const defaultThemeColor = '#3070C2';
const checkThemeColor = (color: string | undefined) => {
  if (isBlank(color)) return false;
  if (color!.length !== 7) return false;

  return true;
};

const styles = (theme: ThemeTypes) => ({
  iconContainer: {
    margin: '0 10px 0 0',
    position: 'relative',
    width: 40,
    minWidth: 40,
    height: 40,
    backgroundColor: (props: AppStoreApplicationLogoProps) => checkThemeColor(props.themeColor) ? props.themeColor : defaultThemeColor,
    borderRadius: '50%',
    overflow: ({ isExtension }: AppStoreApplicationLogoProps) => isExtension ? 'visible' : 'hidden',
  },
  icon: {
    display: 'inline-block',
    width: 40,
    height: 40,
  },
  animationIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
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

export interface AppStoreApplicationLogoClasses {
  iconContainer: string,
  icon: string,
  animationIcon: string,
  iconPin: string,
}

export default styles;
