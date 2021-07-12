import { ThemeTypes } from '@getstation/theme';
import { colors } from '@src/theme';

const styles = (_: ThemeTypes) => ({
  appRequestTooltip: {
    width: 100,
    borderRadius: 5,
    backgroundColor: 'gray',
    position: 'absolute',
    right: 60,
    padding: [6, 0, 8],
    top: 2,
    display: 'none',
    '&.visible': {
      display: 'block',
    },
  },
  addAppBtn: {
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: [[`${colors.stationBlue}`], '!important'],
    cursor: 'pointer',
    '&.addAppBtn_small': {
      padding: [0, 21],
    },
    '&.addAppBtn_big': {
      padding: [0, 31],
    },
  },
  addAppPlusIcon: {
    verticalAlign: 'middle',
    marginLeft: -5,
  },
});

export interface IClasses {
  appRequestTooltip: string,
  addAppBtn: string,
  addAppPlusIcon: string,
}

export default styles;
