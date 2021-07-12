import { colors } from '@src/theme';
import { AppRequestStepsButtonsClassesProps }
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';

const styles = {
  controlsContainer: {
    display: 'flex',
    justifyContent: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'space-between' : 'center',
  },
  cancelBtn: {
    width: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'calc(100%/2 - 7px)' : 'calc(100% - 14px)',
    backgroundColor: colors.blueGray30,
    fontFamily: 'HelveticaNeue',
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(41, 41, 41, .5)',
    padding: [10, 0],
    border: 0,
    borderRadius: 40,
    cursor: 'pointer',
    outline: 'none',
  },
  onContinueBtn: {
    width: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'calc(100%/2 - 7px)' : 'calc(100% - 14px)',
    backgroundColor: ({ bgColor }: AppRequestStepsButtonsClassesProps) => bgColor ? bgColor : colors.stationBlue,
    fontFamily: 'HelveticaNeue',
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    padding: [10, 0],
    border: 0,
    borderRadius: 40,
    cursor: 'pointer',
    outline: 'none',
    opacity: .8,
  },
};

export interface AppRequestStepsButtonsClasses {
  controlsContainer: string,
  cancelBtn: string,
  onContinueBtn: string,
}

export default styles;
