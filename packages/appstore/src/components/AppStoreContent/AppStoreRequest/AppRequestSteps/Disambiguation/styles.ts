import { DisambiguationProps } from '@src/components/AppStoreContent/AppStoreRequest/AppRequestSteps/Disambiguation/Disambiguation';
import { animStylesData } from '@src/shared/constants/constants';

const styles = {
  stepContainer: {
    position: 'absolute',
    top: 39,
    left: 0,
    width: '100%',
    '&.fade-enter': {
      position: 'static',
      transform: ({ animAppearDirection }: DisambiguationProps) => animAppearDirection ?
        `translateX(${animStylesData.translateLeft})` : `translateX(${animStylesData.translateRight})`,
      '&.fade-enter-active': {
        transform: 'translateX(0)',
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-enter-done': {
      position: 'static',
    },
    '&.fade-exit': {
      position: 'absolute',
      top: 39,
      left: 0,
      transform: 'translateX(0)',
      '&.fade-exit-active': {
        transform: ({ animExitDirection }: DisambiguationProps) => animExitDirection ?
          `translateX(${animStylesData.translateLeft})` : `translateX(${animStylesData.translateRight})`,
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-exit-done': {
      position: 'static',
      transform: ({ animExitDirection }: DisambiguationProps) => animExitDirection ?
        `translateX(${animStylesData.translateLeft})` : `translateX(${animStylesData.translateRight})`,
    },
  },
  application: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    height: (props: DisambiguationProps) => props.similarApplications.length < 3 ? props.similarApplications.length * 70 : '180px',
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  separator: {
    marginTop: 15,
    border: 'none',
    height: 1,
    width: '100%',
    backgroundColor: '#F4F4F4',
  },
  itemWrapper: {
    marginTop: 30,
  },
  controlsContainer: {
    marginTop: 40,
  },
};

export interface IClasses {
  stepContainer: string,
  application: string,
  list: string,
  separator: string,
  itemWrapper: string,
  controlsContainer: string,
}

export default styles;
