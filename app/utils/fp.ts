import { equals } from 'ramda';

/**
 * Functional Programming utils
 */

/**
 * These high level types are used to make point-free programming more clear.
 * Please see an example usage in `bang/helpers/organizeSearchResults.ts`
 *
 * ramda-adjunct discussion: https://github.com/char0n/ramda-adjunct/issues/632
 */
export type Predicate<T> = (_: T) => boolean; // represents a simple predicate of arity 1
export type Transformer<T, U = T> = (_: T) => U; // represents a basic pure transformation (a -> b)
export type Selector<T, U> = (_: Readonly<T>) => U; // represents a function which get a value U inside an object T
export type Filter<T> = Transformer<T[]>; // represents a function which filter a collection T[]
export type Sorter<T> = Transformer<T[]>; // represents a function which sort a collection T[]
export type CompareResult = -1 | 0 | 1; // represents a comparison result.
export type Comparator<T> = (a: T, b: T) => CompareResult; // represents a comparison function
export type Pair<T, U = T> = [T, U]; // represents a pair as JS array
export type Reducer<T, U> = (acc: T, value: U) => T; // represent a reducer

/**
 * Create a comparator from a list.
 * all missing item in the given list will be put at the end of the list.
 *
 * ramda-adjunct discussion: https://github.com/char0n/ramda-adjunct/issues/633
 *
 * @example
 * sortBy(identity, createConstantComparator([1, 2, 3]))([0, 2, 0, 3, 0, 1, 0]) //=> [1, 2, 3, 0, 0, 0, 0]
 *
 * @param {T[]} tokens
 * @returns {Comparator<T>}
 */
export const constantComparator = <T>(tokens: T[]): Comparator<T> => {
  return (a: any, b: any) => {
    const [idx1, idx2] = [tokens.findIndex(equals(a)), tokens.findIndex(equals(b))];
    if (idx1 === -1) return 1;
    if (idx2 === -1) return -1;
    if (idx1 === idx2) return 0;
    if (idx1 < idx2) return -1;
    if (idx1 > idx2) return 1;
    return 0;
  };
};
