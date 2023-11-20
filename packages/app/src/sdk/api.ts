import { Consumer } from '@getstation/sdk';
import { BxSDK } from '.';

export const isActiveConsumer = (namespace: string, manifestURL: string, sdk: BxSDK): boolean => {
  return sdk[namespace] &&
    sdk[namespace].provider._consumers.map((c: Consumer) => c.id).includes(manifestURL);
};
