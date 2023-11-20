import { app } from 'electron';
import * as path from 'path';
import { anyPass, equals } from 'ramda';
import { Observer, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as shortid from 'shortid';
// @ts-ignore no definition types
import * as unusedFilename from 'unused-filename';
import { isDarwin } from '../../../../utils/process';
import { ServiceSubscription } from '../../../lib/class';
import { RPC, SubscriptionConstructorParam } from '../../../lib/types';
import {
  DownloadDoneState,
  DownloadItemService,
  DownloadItemServiceObserver,
  DownloadState,
  DownloadUpdatedStatePayload,
} from '../interface';

type ConstructorParams = { downloadItem: Electron.DownloadItem, webContentsId: number, promptDownloadEnabled: boolean };

const observeDownloadItemStateChanged = (item: Electron.DownloadItem): Observable<Electron.DownloadItem> =>
  Observable.create((observer: Observer<Electron.DownloadItem>) => {
    const listener = () => observer.next(item);
    process.nextTick(listener);
    item.on('updated', listener);
    item.once('done', () => {
      listener();
      observer.complete();
    });
    return () => {
      try {
        if (item.getState() !== 'cancelled') {
          item.cancel();
        }
        item.removeListener('updated', listener);
      } catch (e) {}
    };
  });

const isUpdateState: (state: DownloadState) => boolean = anyPass([
  equals('progressing'),
  equals('interrupted'),
]);

const isDoneState: (state: DownloadState) => boolean = anyPass([
  equals('interrupted'),
  equals('cancelled'),
  equals('completed'),
]);

const downloadFinished = (doneState: DownloadDoneState, savePath: string) => {
  if (doneState === 'completed') {
    if (isDarwin) {
      app.dock.downloadFinished(savePath);
    }
  }
};

const tryGetState = (item: Electron.DownloadItem): DownloadState => {
  try {
    return item.getState();
  } catch (e) {
    return 'completed';
  }
};

export class DownloadItemServiceImpl extends DownloadItemService implements RPC.Interface<DownloadItemService> {
  private readonly downloadItem: Electron.DownloadItem;
  private readonly webContentsId: number;
  private readonly savePath: string;
  private downloadItem$: Observable<Electron.DownloadItem>;

  constructor({ downloadItem, webContentsId, promptDownloadEnabled }: ConstructorParams) {
    const downloadId = `download-${shortid.generate()}`;
    super(downloadId); // see `getDownloadId`
    this.downloadItem = downloadItem;
    this.webContentsId = webContentsId;

    this.savePath = unusedFilename.sync(
      path.join(app.getPath('downloads'), this.downloadItem.getFilename())
    );
    // check the one we need to do here
    this.downloadItem$ = observeDownloadItemStateChanged(this.downloadItem);
    if (promptDownloadEnabled) {
      this.downloadItem.setSaveDialogOptions({});
    }else {
      this.downloadItem.setSavePath(this.savePath);
    }
  }

  async addObserver(observer: RPC.ObserverNode<DownloadItemServiceObserver>): Promise<RPC.Subscription> {
    const subscriptions: SubscriptionConstructorParam[] = [
      await this.addOnUpdatedObserver(observer),
    ];
    return new ServiceSubscription(subscriptions, observer);
  }

  async getDownloadId() {
    return this.uuid;
  }

  async getWebContentsId() {
    return this.webContentsId;
  }

  async getSavePath() {
    if (this.downloadItem && typeof this.downloadItem.getSavePath === 'function') {
      return this.downloadItem.getSavePath();
    }
    return this.savePath;
  }

  async whenDone(): Promise<DownloadDoneState> {
    const state$: Observable<DownloadDoneState> = await this.downloadItem$
      .pipe(
        map(tryGetState),
        filter(isDoneState)
      ) as Observable<DownloadDoneState>;
    const done = await state$.toPromise();

    downloadFinished(done, this.savePath);

    return done;
  }

  async pause(): Promise<void> {
    return this.downloadItem.pause();
  }

  async isPaused(): Promise<boolean> {
    return this.downloadItem.isPaused();
  }

  async resume(): Promise<void> {
    return this.downloadItem.resume();
  }

  async canResume(): Promise<boolean> {
    return this.downloadItem.canResume();
  }

  async cancel(): Promise<void> {
    return this.downloadItem.cancel();
  }

  async getURL(): Promise<string> {
    return this.downloadItem.getURL();
  }

  async getFilename(): Promise<string> {
    return this.downloadItem.getFilename();
  }

  async getState(): Promise<DownloadState> {
    return this.downloadItem.getState();
  }

  async getReceivedBytes(): Promise<number> {
    return this.downloadItem.getReceivedBytes();
  }

  async getTotalBytes(): Promise<number> {
    return this.downloadItem.getTotalBytes();
  }

  private async addOnUpdatedObserver(observer: RPC.ObserverNode<DownloadItemServiceObserver>) {
    if (observer.onUpdated) {
      const state$ = this.downloadItem$
        .pipe(
          map(tryGetState),
          filter(isUpdateState),
          map(state => ({ state }))
        ) as Observable<DownloadUpdatedStatePayload>;
      return state$.subscribe(observer.onUpdated);
    }
    return () => {};
  }
}
