import DeprecatedSDKProvider from './SDKProvider';

const provider = new DeprecatedSDKProvider();

export const getProvider = (): DeprecatedSDKProvider => provider;
