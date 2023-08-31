// @ts-ignore no typings
import * as contentDisposition from 'content-disposition';
import { app, BrowserWindow, dialog, Session, session as electronSession, webContents } from 'electron';
import { head } from 'ramda';
// @ts-ignore: no declaration file
import { Observer, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { observeSessions } from '../../api/sessions';
import { ServiceSubscription } from '../../lib/class';
import { RPC, SubscriptionConstructorParam } from '../../lib/types';
import { DownloadItemServiceImpl } from './downloadItem/main';
import { DownloadItemService, DownloadService, DownloadServiceObserver } from './interface';
import { getHeader } from '../../../session';
/**
 * Returns true if the request was a download in the main frame.
 */
function isAttachmentAsMainframe(details: Electron.OnCompletedListenerDetails) {
  if (details.resourceType !== 'mainFrame') {
    return false;
  }

  const { responseHeaders } = details;
  const dispositionHeader: string[] = getHeader('content-disposition', responseHeaders);
  if (!dispositionHeader || !dispositionHeader[0]) {
    return false;
  }

  try {
    const disposition = contentDisposition.parse(dispositionHeader[0]);
    return disposition.type === 'attachment';
  }
  catch (_) {
    // can't parse
    return false;
  }
}

function hasEmptyHistory(webContentsId?: number) {
  if (!webContentsId) return true;
  try {
    return !webContents.fromId(webContentsId).canGoBack;
  } catch (e) { }
  return true;
}

const makeOnWillDownload = (downloadService: DownloadServiceImpl) => {
  return (session: Session): Observable<RPC.Node<DownloadItemService>> =>
    Observable.create((observer: Observer<RPC.Node<DownloadItemService>>) => {
      const listener = (_: Event, downloadItem: Electron.DownloadItem, wc: Electron.WebContents) => {
        const webContentsId = wc.id;
        // ☣️ Not possible to do async thing inside this listener , download-item api check if the stack is the same
        const promptDownloadEnabled = downloadService.getShouldShowPromptPathOnDownload();
        const downloadItemService = new DownloadItemServiceImpl({ downloadItem, webContentsId, promptDownloadEnabled });
        observer.next(downloadItemService);
      };
      session.on('will-download', listener);
      return () => session.removeListener('will-download', listener);
    });
};

const showOpenDialog = async (win: BrowserWindow, options: Electron.OpenDialogOptions): Promise<string | undefined> => {
  const { filePaths } = await dialog.showOpenDialog(win, options);

  if (filePaths) {
    return head(filePaths);
  }

  return undefined;
};

export class DownloadServiceImpl extends DownloadService implements RPC.Interface<DownloadService> {

  private shouldShowPromptPathOnDownload: boolean = false;

  /**
   * Used because will-download cannot have async method inside.
   * So we got the value from saga call when a user toggle it, default is falsy
   */
  getShouldShowPromptPathOnDownload() {
    return this.shouldShowPromptPathOnDownload;
  }

  async setShouldShowPromptPathOnDownload(isEnabled: boolean) {
    this.shouldShowPromptPathOnDownload = isEnabled;
  }

  async applyDownloadFolder(downloadFolder: string) {
    if (!downloadFolder) return false;

    app.setPath('downloads', downloadFolder);
    return true;
  }

  async selectDownloadFolder(defaultPath: string) {
    const win: BrowserWindow | null = BrowserWindow.getFocusedWindow();
    if (!win) return;

    const title = 'Download location';
    const options: Electron.OpenDialogOptions = {
      title,
      message: title,
      buttonLabel: 'Select',
      properties: ['openDirectory', 'createDirectory'],
      defaultPath,
    };

    return await showOpenDialog(win, options);
  }

  async addObserver(observer: RPC.ObserverNode<DownloadServiceObserver>) {
    const subscriptions: SubscriptionConstructorParam[] = [
      await this.addOnRequestCompletedObserver(observer),
      await this.addOnWillDownloadObserver(observer),
    ];
    return new ServiceSubscription(subscriptions, observer);
  }

  private async addOnRequestCompletedObserver(observer: RPC.ObserverNode<DownloadServiceObserver>) {
    await app.whenReady();
    const { defaultSession } = electronSession;
    if (defaultSession && observer.onRequestCompleted) {
      defaultSession.webRequest.onCompleted((details) => {
        if (isAttachmentAsMainframe(details)) {
          observer.onRequestCompleted!({
            ...details,
            hasEmptyHistory: hasEmptyHistory(details.webContentsId),
          });
        }
      });
      return () => defaultSession.webRequest.onCompleted(null as any);
    }
    return () => { };
  }

  private async addOnWillDownloadObserver(observer: RPC.ObserverNode<DownloadServiceObserver>) {
    if (observer.onWillDownload) {
      const onWillDownload$ = observeSessions().pipe(flatMap(makeOnWillDownload(this)));
      return onWillDownload$.subscribe(observer.onWillDownload.bind(observer));
    }
    return () => { };
  }
}
