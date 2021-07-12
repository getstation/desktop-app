import { animStylesData } from '@src/shared/constants/constants';

const styles = {
  stepperContainer: {
    maxWidth: 330,
    minHeight: 780,
    margin: '0 auto',
    position: 'relative',
    overflowX: 'hidden',
  },
  transitionWrapper: {
    '&.fade-appear': {
      transform: `translateX(${animStylesData.translateRight})`,
      '&.fade-appear-active': {
        transform: 'translateX(0)',
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-enter': {
      transform: `translateX(${animStylesData.translateLeft})`,
      '&.fade-enter-active': {
        transform: 'translateX(0)',
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
  },
  componentWrapper: {
    maxWidth: 300,
  },
};

export interface AppRequestEditClasses {
  stepperContainer: string,
  transitionWrapper: string,
  componentWrapper: string,
}

export default styles;
