// @ts-ignore: no declaration file
import LinkedMap from 'linked-map';
import ms from 'ms';

import { ThemeColorScheme } from './types';

// In ms
export const QUICK_DURATION = ms('2sec');
export const QUICK_INTERVAL = 42;

// TODO: fix this
// export const SLOW_DURATION = process.env.STATION_QUICK_TRANSITIONS === '1' ? ms('30sec') : ms('10min');
// export const SLOW_INTERVAL = process.env.STATION_QUICK_TRANSITIONS === '1' ? 167 : ms('10sec');
export const SLOW_DURATION = ms('10min');
export const SLOW_INTERVAL = ms('10sec');

export const DEFAULT_SUNCALC = { dawn: 6, sunrise: 7, midday: 12, afternoon: 14, sunset: 20, night: 22 };

export enum Theme {
  dawn = 'dawn',
  sunrise = 'sunrise',
  morning = 'morning',
  midday = 'midday',
  afternoon = 'afternoon',
  sunset = 'sunset',
  night = 'night',
}

export const COLORS = new LinkedMap();
COLORS.push('dawn', new ThemeColorScheme(
  ['#4372AA', '#81AADE', '#A3C4EC', '#85C0F3'],
  SLOW_DURATION,
  SLOW_INTERVAL
));
COLORS.push('sunrise', new ThemeColorScheme(
  ['#276AAE', '#3C84C4', '#6CADE1', '#8ACBF2'],
  SLOW_DURATION,
  SLOW_INTERVAL
));
COLORS.push('morning', new ThemeColorScheme(
  ['#2B91BA', '#3794C2', '#4B99CF', '#629FDD'],
  SLOW_DURATION,
  SLOW_INTERVAL
));
COLORS.push('midday', new ThemeColorScheme(
  ['#2EB3C3', '#399AD5', '#558DDA', '#3872C7'],
  QUICK_DURATION,
  QUICK_INTERVAL
));
COLORS.push('afternoon', new ThemeColorScheme(
  ['#6BB7EA', '#61ACE4', '#4E96D5', '#286AAE'],
  QUICK_DURATION,
  QUICK_INTERVAL
));
COLORS.push('sunset', new ThemeColorScheme(
  ['#5486B2', '#5381B0', '#5179AC', '#4F6FA7'],
  QUICK_DURATION,
  QUICK_INTERVAL
));
COLORS.push('night', new ThemeColorScheme(
  ['#415B82', '#3A587C', '#4E7497', '#7272A0'],
  QUICK_DURATION,
  QUICK_INTERVAL
));
