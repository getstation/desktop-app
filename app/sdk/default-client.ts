import bxsdk from '@getstation/sdk';
import bxSDK from './index';

export const defaultClientOptions = {
  id: 'default',
  name: 'default',
};

export default bxsdk(
  defaultClientOptions,
  bxSDK
);
