import {
  COLORS,
  Coordinates,
  DEFAULT_SUNCALC,
  getGradient as gradient,
  QUICK_DURATION,
  ThemeColorScheme,
} from '@getstation/theme';
import { app } from 'electron';
// @ts-ignore: no declaration file
import { getLocation } from 'ip-geolocate';
import * as memoize from 'memoizee';
// @ts-ignore: no declaration file
import * as mod from 'mod-op';
import { v4 as getMyPublicIPv4 } from 'public-ip';
// @ts-ignore: no declaration file
import * as SunCalc from 'suncalc';
import { isPackaged } from '../utils/env';
import log from 'electron-log';

const locationServiceUrl = 'https://freegeoip.app/json/';

function getSVGCircle(): string {
  const circleFn = (color: string) =>
    `<circle fill="${color}" r="14.846395" cy="229.11598" cx="255.59875" />`;
  if (isPackaged) {
    if (app && app.name.toLowerCase().indexOf('canary') !== -1) {
      return circleFn('goldenrod');
    }
    return '';
  }
  return circleFn('cornflowerblue');
}

export const getSecondsSinceMidnight = () => {
  const date = new Date();
  return mod((date.getTime() / 1000) - (date.getTimezoneOffset() * 60), 86400);
};

export const getMomentOfTheDay = (suncalc?: SunCalc): string | undefined => {
  const startTransition = getTransitionsMap(suncalc);

  const seconds = getSecondsSinceMidnight();
  const keys = Array.from(startTransition.keys());
  const values = Array.from(startTransition.values());
  let value = values.reduce(
    (res, val) => {
      if (val <= seconds && val > res) return val;
      return res;
    },
    0
  );
  // Circular array
  if (value === 0 && values.indexOf(0) === -1) {
    value = values[values.length - 1];
  }
  return keys[values.indexOf(value)];
};

export const getMomentOfTheDayAndProgress = (suncalc?: SunCalc): [string, number] => {
  const startTransition = getTransitionsMap(suncalc);
  const momentOfTheDay = getMomentOfTheDay(suncalc);
  const colors: ThemeColorScheme | undefined = COLORS.get(momentOfTheDay);

  if (!momentOfTheDay || !colors) throw new Error(`Unknow moment ${momentOfTheDay} or color`);

  if (colors.duration === QUICK_DURATION) {
    return [momentOfTheDay, 0];
  }

  const startingTimeInSeconds = startTransition.get(momentOfTheDay)!;
  const endTimeInSeconds = startingTimeInSeconds + (colors.duration / 1000.0);
  const seconds = getSecondsSinceMidnight() * 1.0;
  const ratio = (seconds - startingTimeInSeconds) / (endTimeInSeconds - startingTimeInSeconds);

  return [momentOfTheDay, ratio > 1 ? 1 : ratio];
};

export function getGradient(color1: string, color2: string, ratio: number) {
  return gradient(color1, color2, ratio);
}

export const getMyCoordinates = memoize(
  (): Promise<Coordinates | undefined> =>
    getMyPublicIPv4()
      .then((ip: string) => new Promise((resolve, reject) => {
        getLocation(
          ip,
          { serviceUrl: locationServiceUrl },
          (err: any, loc: object) => {
            if (err) return reject(err);
            resolve(loc);
          }
        );
      }))
      .then(({ latitude, longitude }: any) => ({
        latitude,
        longitude,
      }))
      .catch((err: any) => {
        log.error('Getting public IP and location did not work\n', err);
        return undefined;
      }),
  {
    promise: true,
    maxAge: 60 * 60 * 1000,
  }
);

export const getSunCalc = memoize(
  (coords?: Coordinates): SunCalc | undefined => {
    // If coordinates are undefined = abort
    if (!coords) {
      return undefined;
    }

    const times = SunCalc.getTimes(new Date(), coords.latitude, coords.longitude);
    let suncalc = {};

    Object.keys(times).forEach((key: string) => {
      suncalc = {...suncalc, ...{
        [key]: times[key].getHours() + (times[key].getMinutes() / 60),
      }};
    });

    return suncalc;
  },
  { maxAge: 60 * 60 * 1000 }
);

export const fixSuncalc = (suncalc: SunCalc) => {
  return Object.assign({}, ...Object.entries(suncalc).map(([k, v]) => {
    // Drop invalid values
    if (typeof v !== 'number') return {};
    switch (k) {
      case 'nightEnd':
        // Fix key name
        return { dawn: v };
      case 'sunrise':
      case 'sunset':
      case 'night':
        // Keep valid values
        return { [k]: v };
      default:
        return {};
    }
  }));
};

// check the suncalc value and override with default value if not a number
export const getValidSuncalc = (suncalc: SunCalc): any => {
  const fixedSuncalc = fixSuncalc(suncalc);
  return Object.assign({}, DEFAULT_SUNCALC, fixedSuncalc);
};

// Keys are in seconds (from midnight)
export const getTransitionsMap = memoize((suncalc?: SunCalc) => {
  const { dawn, sunrise, midday, afternoon, sunset, night } = suncalc ? getValidSuncalc(suncalc) : DEFAULT_SUNCALC;
  const morning = sunrise + 1;

  return new Map([
    ['dawn', dawn * 3600],
    ['sunrise', sunrise * 3600],
    ['morning', morning * 3600],
    ['midday', midday * 3600],
    ['afternoon', afternoon * 3600],
    ['sunset', sunset * 3600],
    ['night', night * 3600],
  ]);
});

export function getSVG(colors: string[], size: number = 512, withBackground: boolean = true) {
  // tslint:disable-next-line:max-line-length
  const d = 'M210,244.263158 C244.183519,244.263158 271.894737,216.55194 271.894737,182.368421 C271.894737,148.184902 244.183519,120.473684 210,120.473684 C175.816481,120.473684 148.105263,148.184902 148.105263,182.368421 C148.105263,216.55194 175.816481,244.263158 210,244.263158 Z M210,270.789474 C161.166401,270.789474 121.578947,231.20202 121.578947,182.368421 C121.578947,133.534822 161.166401,93.9473684 210,93.9473684 C258.833599,93.9473684 298.421053,133.534822 298.421053,182.368421 C298.421053,231.20202 258.833599,270.789474 210,270.789474 Z M143.684211,297.039474 L276.315789,297.039474 L276.315789,319.144737 L143.684211,319.144737 L143.684211,297.039474 Z';
  const bg = `<g fill="none" fill-rule="evenodd" transform="translate(20 20)">
    <use fill="black" filter="url(#a)" xlink:href="#b"/>
    <use fill="white" xlink:href="#b"/>
  </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <rect id="b" width="470" height="470" rx="235"/>
      <linearGradient id="c" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop stop-color="${colors[0]}" offset="0%"/>
        <stop stop-color="${colors[1]}" offset="21.769%"/>
        <stop stop-color="${colors[2]}" offset="58.263%"/>
        <stop stop-color="${colors[3]}" offset="100%"/>
      </linearGradient>
    </defs>
    ${withBackground ? bg : ''}
    <g fill="none" fill-rule="evenodd" transform="translate(46 46)">
      <path
        fill="url(#c)"
        fill-rule="nonzero"
        d="${d}"
      />
    </g>
    ${getSVGCircle()}
  </svg>`;
}
