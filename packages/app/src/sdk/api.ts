import { Consumer } from '@getstation/sdk';
import { BxSDK } from '.';

export const isActiveConsumer = (namespace: string, manifestURL: string, sdk: BxSDK): boolean => {
  const consumer = (sdk as Record<string, any>)[namespace];
  return consumer &&
    consumer.provider._consumers.map((c: Consumer) => c.id).includes(manifestURL);
};
