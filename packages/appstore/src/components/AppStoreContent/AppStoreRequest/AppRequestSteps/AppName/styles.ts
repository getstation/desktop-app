import { Props } from '@src/components/AppStoreContent/AppStoreRequest/AppRequestSteps/AppName/AppName';
import { animStylesData } from '@src/shared/constants/constants';

const styles = {
  stepContainer: {
    maxWidth: 300,
    marginTop: 48,
    position: 'absolute',
    top: 39,
    left: 0,
    width: '100%',
    '&.fade-enter': {
      position: 'absolute',
      top: 39,
      left: 0,
      transform: ({ animAppearDirection }: Props) => animAppearDirection ?
        `translateX(${animStylesData.translateRight})` : `translateX(${animStylesData.translateLeft})`,
      '&.fade-enter-active': {
        position: ({ animAppearDirection }: Props) => animAppearDirection ?
          'absolute' : 'static',
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
        transform: ({ animExitDirection }: Props) => animExitDirection ?
          `translateX(${animStylesData.translateRight})` : `translateX(${animStylesData.translateLeft})`,
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-exit-done': {
      transform: ({ animExitDirection }: Props) => animExitDirection ?
        `translateX(${animStylesData.translateRight})` : `translateX(${animStylesData.translateLeft})`,
    },
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: '#292929',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 38,
  },
};

export interface IClasses {
  stepContainer: string,
  subTitle: string,
  inputContainer: string,
}

export default styles;
