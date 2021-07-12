import * as React from 'react';
import injectSheet from 'react-jss';
import Lottie from 'react-lottie';
// @ts-ignore
import * as preloaderAnimationData from '@src/shared/animations/preloader-animation.json';

import styles, { AppStorePreloaderClasses } from './styles';

export interface AppStorePreloaderProps {
  classes?: AppStorePreloaderClasses,
  isAnimationStopped: boolean,
}

export type AppStorePreloaderState = {
  isStopped: boolean,
};

@injectSheet(styles)
export default class AppStorePreloader extends React.PureComponent<AppStorePreloaderProps, AppStorePreloaderState> {

  constructor(props: AppStorePreloaderProps) {
    super(props);
    this.state = { isStopped: true };
  }

  render() {
    const { classes, isAnimationStopped } = this.props;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: preloaderAnimationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };
    return (
      <div className={classes!.animationIcon}>
        <Lottie
          options={defaultOptions}
          height={160}
          width={160}
          isStopped={isAnimationStopped}
        />
      </div>
    );
  }
}
