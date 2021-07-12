import { Icon, IconSymbol } from '@getstation/theme';
import * as React from 'react';
import injectSheet from 'react-jss';
import Lottie from 'react-lottie';
// @ts-ignore
import * as animationData from '@src/shared/animations/add-application-animation.json';

import styles, { AppStoreApplicationLogoClasses } from './styles';

export type AppStoreApplicationLogoProps = {
  classes?: AppStoreApplicationLogoClasses,
  iconURL: string,
  themeColor?: string,
  isExtension?: boolean,
  isAnimationStopped: boolean,
  toggleAnimation: (isAnimationStopped: boolean) => void,
};

export type AppStoreApplicationLogoState = {
  isStopped: boolean,
};

@injectSheet(styles)
export default class AppStoreApplicationLogo extends React.PureComponent<AppStoreApplicationLogoProps, AppStoreApplicationLogoState> {

  constructor(props: any) {
    super(props);
    this.state = { isStopped: true };
  }

  render() {
    const { classes, isExtension, iconURL, isAnimationStopped, toggleAnimation } = this.props;
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    return (
      <div className={classes!.iconContainer}>
        { iconURL ?
          <svg className={classes!.icon}>
            {isAnimationStopped &&
              <image xlinkHref={`${iconURL}`} width={40} height={40} className={classes!.icon}/>
            }
          </svg>
          :
          <Icon symbolId={IconSymbol.APP_ICON_PLACEHOLDER} size={40}/>
        }

        {!isAnimationStopped &&
          <div className={classes!.animationIcon}>
            <Lottie
              options={defaultOptions}
              height={40}
              width={40}
              isStopped={isAnimationStopped}
              eventListeners={[
                {
                  eventName: 'complete',
                  callback: () => toggleAnimation(true),
                },
              ]}
            />
          </div>
        }

        {
          isExtension &&
          <div className={classes!.iconPin}>
            <Icon symbolId={IconSymbol.EXTENSION} size={25} color={'#5d5d5d'}/>
          </div>
        }
      </div>
    );
  }
}
