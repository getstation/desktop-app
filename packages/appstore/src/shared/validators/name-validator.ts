import { minAppNameLength } from '@src/shared/constants/constants';

export function isValidName(value: string) {
  return value.trim().length > minAppNameLength;
}
