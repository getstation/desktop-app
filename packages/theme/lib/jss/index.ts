import Color from 'color';
import * as CSS from 'csstype';

/**
 * getGradientCSSBackground
 *
 * @param {string[]} themeColors - the array of colors for the current theme
 * @returns {string} the linear-gradient CSS value that represents the theme colors gradient
 */
export const getGradientCSSBackground = (themeColors: string[]) => {
  return `linear-gradient(-180deg, ${themeColors[0]} 0vh, ${themeColors[1]} 22vh, ${themeColors[2]} 58vh, ${themeColors[3]} 100vh)`;
};

/**
 * getOpacityGradient
 *
 * @param {number} opacity - the opacity
 * @returns {string} the linear-gradient CSS value that represents the opacity gradient
 */
export const getOpacityGradient = (opacity: number) => {
  return `linear-gradient(-180deg, rgba(0,0,0,${opacity}) 0vh, rgba(0,0,0,${opacity}) 100vh)`;
};

/**
 * getHighlightGradient
 *
 * @param {string} direction - direction of the gradient
 * @param {number} opacity - opacity of the gradient
 * @returns {string} the linear-gradient CSS value that represents...
 */
export const getHighlightGradient = (direction: string = 'to right', opacity: number = 0.15) => {
  return `linear-gradient(${direction}, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.03) 7%, rgba(255, 255, 255, ${opacity}) 100%);`;
};

/**
 * getGradientWithOverlay
 *
 * @param {string[]} themeColors - the array of colors for the current theme
 * @param {number} opacity - opacity of the gradient
 * @returns {string} the linear-gradient CSS value that represents an opacity gradient on top of the theme colors gradient
 */
export const getGradientWithOverlay = (themeColors: string[], opacity: number) => {
  const gradient = getGradientCSSBackground(themeColors);
  const opacityGradient = getOpacityGradient(opacity);

  return `${opacityGradient}, ${gradient}`;
};

/**
 * fontMixin
 *
 * @param {number} size - size of the font
 * @param {string | number} weight - weight of the font
 * @returns {{fontFamily: string; fontSize: number; fontWeight: string | number}} the corresponding fonts CSS properties
 */
const fontMixin = (size: CSS.Property.FontSize<number>, weight: CSS.Property.FontWeight = 'normal') => ({
  fontFamily:
    `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol"`,
  fontSize: size,
  fontWeight: weight,
});

export const theme = {
  colors: {
    gray: {
      light: '#F4F4F4',
      middle: '#949494',
      dark: '#292929',
    },
    flatRed: {
      middle: '#e75858',
      dark: '#B83636',
    },
    black: '#292929',
    error: '#FF8686',
  },
  titles: {
    h1: {
      ...fontMixin(26),
      lineHeight: '1.3em',
      marginBottom: 14,
    },
    h2: {
      ...fontMixin(20, 500),
      lineHeight: '31px',
    },
    h3:{
      ...fontMixin(16),
      letterSpacing: -0.4,
      lineHeight: '1.5em',
    },
  },
  icons: {
    color: {
      base: '#FFF',
    },
  },
  mixins: {
    ellipsis: (nbLines: number = 2) => ({
      display: '-webkit-box',
      '-webkit-line-clamp': nbLines,
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
    }),
    flexbox: {
      containerCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    size: (size: number | string) => ({
      width: size,
      height: size,
    }),
    position: (
      position: CSS.Properties['position'],
      top?: number | string,
      left?: number | string,
      bottom?: number | string,
      right?: number | string,
    ) => ({
      position,
      top,
      left,
      bottom,
      right,
    }),
  },
  dock: {
    size: 50,
  },
  rightDock: {
    size: 50,
  },

  // == Base
  $gutter: '10px',
  $borderRadius: '4px',
  $imPath: '../../static/',

  // == Colors
  $red: '#FF5F5C',

  // == Z-indexes
  $zindexUltime: 1000,
  $zIndexSupra: 100,
  $zIndexUltra: 10,
  $zIndexMega: 9,
  $zIndexHuge: 4,
  $zIndexLarge: 3,
  $zIndexMedium: 2,
  $zIndexSmall: 1,
  $zIndexNull: 0,

  // == Global variables
  $bodyBkg: '#fff',
  $osbarHeight: '30px',
  $appSize: '50px',

  /**
   * avatarMixin
   *
   * @param {string} value - the width and height value
   * @param {string} radius - the border radius value
   * @returns {{height: string; width: string; borderRadius: string; backgroundClip: string}} the corresponding CSS properties
   */
  avatarMixin: (value: string, radius = value) => ({
    height: value,
    width: value,
    borderRadius: radius,
    backgroundClip: 'padding-box',
  }),

  /**
   * covererMixin
   *
   * @param {number} bottom - value of the bottom property
   * @param {number} left - value of the left property
   * @param {number} right - value of the right property
   * @param {number} top - value of the top property
   * @returns {{bottom: number; left: number; position: string; right: number; top: number}} the corresponding CSS properties
   */
  covererMixin: (bottom = 0, left = 0, right = 0, top = 0) => ({
    bottom: bottom,
    left: left,
    position: 'absolute',
    right: right,
    top: top,
  }),

  fontMixin,

  /**
   * elipsisMixin
   *
   * @param {number} lineClamp - value of the line-clamp property
   * @returns {{display: string; "-webkit-line-clamp": number; "-webkit-box-orient": string; overflow: string; textOverflow: string}}
   * the corresponding CSS properties
   */
  elipsisMixin: (lineClamp = 2) => ({
    display: '-webkit-box',
    '-webkit-line-clamp': lineClamp,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  /**
   * mixinDarkenColor
   *
   * @param {string} color - the corresponding color
   * @param {number} ratio - the ratio to daren the color
   * @returns {string} - the color darkened by the ratio
   */
  mixinDarkenColor: (color: string, ratio = 0.3) =>
    Color(color).mix(Color('black'), ratio).rgb().string(),
};

/**
 * roundedBackground
 *
 * @param {string} color - color for the background
 * @returns {{borderRadius: string; backgroundColor: string}} the corresponding CSS properties
 */
export const roundedBackground = (color: string = '#eee') => {
  return {
    borderRadius: '999px',
    backgroundColor: color,
  };
};
