import { equals, find, pipe } from 'ramda';
import { SearchResultSerialized } from '../duck';

/**
 * Get the ID of a SearchResultSerialized
 *
 * @param {SearchResultSerialized} item
 * @return {string}
 */
export const getId = (item: SearchResultSerialized) => item.uniqId || item.resourceId;

/**
 * Find a SearchResultSerialized using id
 *
 * @param {string} id
 * @param {SearchResultSerialized[]} items
 * @returns {SearchResultSerialized | undefined}
 */
export const findItemById = (id: string, items: SearchResultSerialized[]): SearchResultSerialized | undefined =>
  find(
    pipe(
      getId,
      equals(id)
    ),
    items
  );
