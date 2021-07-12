import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';

export interface OnCompletedDetails {
  webContentsId?: number;
  url: string;
  resourceType: string;
  responseHeaders: object;
  hasEmptyHistory: boolean;
}

// One instance by process
@service('download')
export class DownloadService extends ServiceBase implements RPC.Interface<DownloadService> {
  // @ts-ignore
  addObserver(observer: RPC.ObserverNode<DownloadServiceObserver>): Promise<RPC.Subscription> {}
  // @ts-ignore
  applyDownloadFolder(downloadFolder: string): Promise<boolean> {}

  // @ts-ignore
  setShouldShowPromptPathOnDownload(isEnabled: boolean): Promise<void> {}

  @timeout(0) // will await for user input
  // @ts-ignore
  selectDownloadFolder(defaultPath: string): Promise<string | void> {}
}

// listen on all sessions.
// This observer is global amongst all Sessions and all WebContentses
export type DownloadState = 'progressing' | 'completed' | 'cancelled' | 'interrupted';
export type DownloadUpdatedState = 'progressing' | 'interrupted';
export type DownloadDoneState = 'completed' | 'cancelled' | 'interrupted';
export type DownloadUpdatedStatePayload = { state: DownloadUpdatedState };

@service('download')
export class DownloadItemService extends ServiceBase implements RPC.Interface<DownloadItemService> {
  // @ts-ignore
  getDownloadId(): Promise<string> {}
  // @ts-ignore
  getWebContentsId(): Promise<number> {}
  // @ts-ignore
  getSavePath(): Promise<string> {}

  @timeout(0) // download can take more time than timeout
  // @ts-ignore
  whenDone(): Promise<DownloadDoneState> {}
  // @ts-ignore
  pause(): Promise<void> {}
  // @ts-ignore
  isPaused(): Promise<boolean> {}
  // @ts-ignore
  resume(): Promise<void> {}
  // @ts-ignore
  canResume(): Promise<boolean> {}
  // @ts-ignore
  cancel(): Promise<void> {}
  // @ts-ignore
  getURL(): Promise<string> {}
  // @ts-ignore
  getFilename(): Promise<string> {}
  // @ts-ignore
  getState(): Promise<DownloadState> {}
  // @ts-ignore
  getReceivedBytes(): Promise<number> {}
  // @ts-ignore
  getTotalBytes(): Promise<number> {}
  // @ts-ignore
  addObserver(observer: RPC.ObserverNode<DownloadItemServiceObserver>): Promise<RPC.Subscription> {}
}

@service('download', { observer: true })
export class DownloadItemServiceObserver extends ServiceBase implements RPC.Interface<DownloadItemServiceObserver> {
  // @ts-ignore
  onUpdated(state: DownloadUpdatedStatePayload): void {
  }
}

// For specific observer by WebContents, see WebContentsService
@service('download', { observer: true })
export class DownloadServiceObserver extends ServiceBase implements RPC.Interface<DownloadServiceObserver> {
  // get details on a completed download request
  // @ts-ignore
  onRequestCompleted(details: OnCompletedDetails): void {}

  // @ts-ignore
  onWillDownload(item: RPC.Node<DownloadItemService>): void {}
}
