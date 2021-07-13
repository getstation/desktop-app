import { app } from 'electron';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Rx';
import { ServiceSubscription } from '../../lib/class';
import { RPC, ServiceBaseConstructorOptions } from '../../lib/types';
import { AutoUpdaterService, AutoUpdaterServiceObserver } from './interface';
import { autoUpdater } from './lib';

export class AutoUpdaterServiceImpl extends AutoUpdaterService implements RPC.Interface<AutoUpdaterService> {
  private updateDownloaded: boolean;

  constructor(uuid?: string, options?: ServiceBaseConstructorOptions) {
    super(uuid, options);
    this.updateDownloaded = false;
  }

  async quitAndInstall() {
    if (this.updateDownloaded) {
      autoUpdater.quitAndInstall();
    } else {
      app.quit();
    }
  }

  async checkForUpdates() {
    autoUpdater.checkForUpdates();
  }

  async addObserver(observer: RPC.ObserverNode<AutoUpdaterServiceObserver>) {
    const subscriptions: Subscription[] = [];

    if (observer.onCheckingForUpdate) {
      subscriptions.push(
        fromEvent(autoUpdater, 'checking-for-update').subscribe(() => {
          observer.onCheckingForUpdate!();
        })
      );
    }

    if (observer.onUpdateDownloaded) {
      subscriptions.push(
        fromEvent(autoUpdater, 'update-downloaded', (eventOrInfo, _releaseNotes, releaseName) => releaseName || eventOrInfo.version)
          .subscribe(releaseName => {
            this.updateDownloaded = true;
            observer.onUpdateDownloaded!({ releaseName });
          })
      );
    }

    if (observer.onUpdateNotAvailable) {
      subscriptions.push(
        fromEvent(autoUpdater, 'update-not-available').subscribe(() => {
          observer.onUpdateNotAvailable!();
        })
      );
    }

    if (observer.onUpdateAvailable) {
      subscriptions.push(
        fromEvent(autoUpdater, 'update-available').subscribe(() => {
          observer.onUpdateAvailable!();
        })
      );
    }

    if (observer.onError) {
      subscriptions.push(
        fromEvent<[Error]>(autoUpdater, 'error').subscribe(e => {
          observer.onError!({ message: e[0].message });
        })
      );
    }

    return new ServiceSubscription(() => {
      subscriptions.forEach(s => s.unsubscribe());
    }, observer);
  }

}
