// @ts-ignore no declaration file
import * as AutoLaunch from 'auto-launch';
import log from 'electron-log';

import { RPC } from '../../lib/types';
import { AutolaunchProviderService, AutolaunchService } from './interface';

export class AutolaunchServiceImpl extends AutolaunchService implements RPC.Interface<AutolaunchService> {
  private provider?: RPC.Node<AutolaunchProviderService>;

  async setAutolaunchProvider(provider: RPC.Node<AutolaunchProviderService>): Promise<void> {
    this.provider = provider;
  }

  async set(enable: boolean) {
    if (!this.provider) {
      throw new Error('missing autolaunch provider service');
    }

    // optimistically set the AutoLaunch status in store
    // for UI recactivity. Will correct later if needed
    await this.provider.setAutoLaunchEnabled(enable);

    try {
      const appName = await this.provider.getAppName();

      // Fix for AppImage
      // see https://github.com/Teamwork/node-auto-launch/issues/85#issuecomment-403974827
      const autolaunchConfig = process.env.APPIMAGE ? {
        name: appName,
        path: process.env.APPIMAGE,
      } : { name: appName };
      const autoLauncher = new AutoLaunch(autolaunchConfig);
  
      let isAutoLaunched;
      try {
        isAutoLaunched = await autoLauncher.isEnabled();
      } 
      catch (e) {
        isAutoLaunched = false;
      }

      if (enable && !isAutoLaunched) {
        await autoLauncher.enable();
      } else if (!enable && isAutoLaunched) {
        await autoLauncher.disable();
      }
    } 
    catch (e) {
      log.error('autoLauncher enable/disable failed', e);
      await this.provider.setAutoLaunchEnabled(false);
    }
  }
}
