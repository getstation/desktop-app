import { ThemeTypes } from '@getstation/theme';
import { ConfirmationProps } from '@src/components/AppStoreContent/AppStoreRequest/AppRequestSteps/Confirmation/Confirmation';
import { animStylesData } from '@src/shared/constants/constants';

const styles = (theme: ThemeTypes) => ({
  stepContainer: {
    maxWidth: 310,
    position: 'absolute',
    top: 64,
    left: 0,
    '&.fade-enter': {
      position: 'static',
      transform: `translateX(${animStylesData.translateRight})`,
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
      top: 64,
      left: 0,
      transform: 'translateX(0)',
      '&.fade-exit-active': {
        transform: `translateX(${animStylesData.translateRight})`,
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-exit-done': {
      position: 'static',
      transform: `translateX(${animStylesData.translateRight})`,
    },
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 38,
  },
  logo: {
    width: 60,
    borderRadius: 60,
    marginBottom: 11,
  },
  appName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#363636',
    marginBottom: 25,
  },
  title: {
    textAlign: 'center',
    marginTop: 0,
  },
  text: {
    fontSize: 17,
    color: '#4a4a4a',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
  },
  imageUploadedBg: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginBottom: 11,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: ({ themeColor } : ConfirmationProps) => themeColor,
  },
  imageUploaded: {
    ...theme.mixins.size(60),
  },
});

export interface IClasses {
  stepContainer: string,
  stepContent: string,
  appName: string,
  title: string,
  text: string,
  logo: string,
  imageUploadedBg: string,
  imageUploaded: string,
}

export default styles;
