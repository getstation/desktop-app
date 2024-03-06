import * as Immutable from 'immutable';
import { FromJS } from '../types';

export const fromJS: FromJS = Immutable.fromJS;

export const isNotNil = <T>(value: T | undefined | null): value is NonNullable<T> => {
  return (value !== null && value !== undefined);
};

export default {
  isNotNil,
  fromJS,
};
