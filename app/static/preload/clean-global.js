/**
 * Find entries that have been added between an initial and a modified
 * array then remove them from the given element IF NOT whitelisted.
 * @param {*} initial Array of intial values
 * @param {*} modified Array of modified values
 * @param {*} whitelist Array of values to keep in element even if missing initially
 * @param {*} element Element to delete the diff from
 */
export const removeDiff = (initial, modified, whitelist, element) => {
  const set = new Set(initial);
  return modified.reduce((acc, value) => {
    // If the key initially exists or is whitelisted, do nothing
    if (set.has(value) || whitelist.has(value)) return acc;

    // If not, remove from element and log
    // eslint-disable-next-line no-param-reassign
    delete element[value];
    return [...acc, value];
  }, []);
};
