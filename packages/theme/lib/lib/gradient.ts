import Color from 'color';

/**
 * getGradient
 *
 * @param {string} color1 - first color of the gradient
 * @param {string} color2 - last color of the gradient
 * @param {number} ratio - ?
 * @returns {string} a gradient between the two colors
 */
export const getGradient = (color1: string, color2: string, ratio: number) => {
  const start = Color(color1);
  const end = Color(color2);

  if (!ratio || ratio <= 0) return start.rgb().string();
  if (ratio >= 1) return end.rgb().string();

  return start.mix(end, ratio).rgb().string();
};

/**
 * getGradients
 *
 * @param {string[]} colors1 - first colors array of the gradient
 * @param {string[]} colors2 - last colors array of the gradient
 * @param {number} duration - duration of the transition (define the number of colors array)
 * @param {number} frameInterval - ?
 * @returns {(string)[][]} an array of colors array
 */
export const getGradients = (colors1: string[], colors2: string[], duration: number, frameInterval: number) => {
  if (colors1.length !== colors2.length) {
    throw new Error(`colors1 and colors2 should have the same length (${colors1.toString()}, ${colors2.toString()})`);
  }
  const numberOfSteps = Math.floor(duration / frameInterval);

  return Array(numberOfSteps).fill(undefined).map((_: any, index: number) => {
    const ratio = index / numberOfSteps;
    return colors1.map((color1: string, indexbis: number) => {
      const color2 = colors2[indexbis];
      return getGradient(color1, color2, ratio);
    });
  });
};
