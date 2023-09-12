import { app, BrowserWindow, globalShortcut } from 'electron';
import { share } from 'rxjs/operators';
import { fromEvent, fromEventPattern, Observable, Subject, Subscription } from 'rxjs';

import ContextMenu, { ContextMenuContext } from '../../../context-menu';
import { SHORTCUTS } from '../../../keyboard-shortcuts';
import { handleError, subscribeToEvent, subscribeToIPCMessage } from '../../api/helpers';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { getWebContentsFromIdOrThrow } from '../tab-webcontents/api';
import {
  ContextMenuService,
  ContextMenuServiceManager,
  ContextMenuServiceObserver,
  IMenuServiceObserverOnClickItemParam,
  IMenuServiceSetMenuItemBooleanParam,
  MenuService,
  MenuServiceObserver,
} from './interface';
import { BrowserXMenuManager } from './menuManager';
import AutofillContextMenu from '../../../context-menus/autofill-menu';

export class MenuServiceImpl extends MenuService implements RPC.Node<MenuService> {

  protected menuManager: BrowserXMenuManager;
  protected globalShortcutsObservable: Observable<unknown>;
  
  constructor(uuid?: string) {
    super(uuid, { ready: false });
    this.menuManager = new BrowserXMenuManager();
    app.whenReady().then(() => {
      this.globalShortcutsObservable = this.registerGlobalShortcuts();
      app.applicationMenu = this.menuManager.menu;
      this.ready();
    }).catch(handleError());
    app.on('before-quit', () => {
      globalShortcut.unregisterAll();
    });
  }

  async addObserver(observer: RPC.ObserverNode<MenuServiceObserver>) {
    const subscriptions: Subscription[] = [];

    if (observer.onClickItem) {
      subscriptions.push(fromEvent(this.menuManager, 'click-item')
        .subscribe((params: IMenuServiceObserverOnClickItemParam) => {
          observer.onClickItem!(params);
        }));
    }

    if (observer.onGlobalBangShortcut) {
      await this.whenReady();
      subscriptions.push(this.globalShortcutsObservable
        .subscribe(() => {
          observer.onGlobalBangShortcut!();
        }));
    }

    return new ServiceSubscription(() => {
      subscriptions.forEach(s => s.unsubscribe());
    }, observer);
  }

  async setChecked({ menuItemId, value }: IMenuServiceSetMenuItemBooleanParam) {
    if (!this.menuManager) {
      throw new Error('missing menu provider service');
    }
    const menuItem = this.menuManager.menu.getMenuItemById(menuItemId);
    if (menuItem) {
      menuItem.checked = value;
    }
  }

  async setEnabled({ menuItemId, value }: IMenuServiceSetMenuItemBooleanParam) {
    if (!this.menuManager) {
      throw new Error('missing menu provider service');
    }
    const menuItem = this.menuManager.menu.getMenuItemById(menuItemId);
    if (menuItem) {
      menuItem.enabled = value;
    }
  }

  async setVisible({ menuItemId, value }: IMenuServiceSetMenuItemBooleanParam) {
    if (!this.menuManager) {
      throw new Error('missing menu provider service');
    }
    const menuItem = this.menuManager.menu.getMenuItemById(menuItemId);
    if (menuItem) {
      menuItem.visible = value;
    }
  }

  protected registerGlobalShortcuts() {
    const globalBang: Electron.Accelerator = SHORTCUTS['global-bang'].accelerator as string;
    return fromEventPattern(
      h => globalShortcut.register(globalBang, h),
      () => globalShortcut.unregister(globalBang),
    ).pipe(share());
  }
}

export class ContextMenuServiceManagerImpl extends ContextMenuServiceManager implements RPC.Node<ContextMenuServiceManager> {
  async create(params: { webcontentsId: number }) {
    return new ContextMenuServiceImpl(params.webcontentsId);
  }
}

export class ContextMenuServiceImpl extends ContextMenuService implements RPC.Node<ContextMenuService> {
  protected webContentsId: number;
  protected contextMenuObservable: Subject<IMenuServiceObserverOnClickItemParam>;

  constructor(webContentsId: number) {
    super();
    this.webContentsId = webContentsId;
    this.contextMenuObservable = new Subject();
  }

  async popup(params: { props: Electron.ContextMenuParams, context?: Exclude<ContextMenuContext, 'webContents'> }) {
    const wc = await getWebContentsFromIdOrThrow(this.webContentsId);

    const contextMenu = new ContextMenu(params.props, {
      ...params.context,
      webContents: wc,
    });
    this.subscribeClickItem(contextMenu, this.contextMenuObservable);

    contextMenu.popup(BrowserWindow.fromWebContents(wc.hostWebContents));
  }

  async popupAutofill({ emails, rect }: { emails: [string], rect: any }) {
    const wc = await getWebContentsFromIdOrThrow(this.webContentsId);

    const autofill = new AutofillContextMenu(emails);
    this.subscribeClickItem(autofill, this.contextMenuObservable);

    autofill.popup({
      window: BrowserWindow.fromWebContents(wc.hostWebContents),
      // The rect we receive is given without our own UI elements
      // Hence the added offset value which correspond to dock (50) & top rack (38)
      x: Math.floor(rect.left + 50),
      y: Math.floor(rect.bottom + 38 + 5), // add 5 for padding
    });
  }

  async addObserver(observer: RPC.ObserverNode<ContextMenuServiceObserver>) {
    const subscriptions: Subscription[] = [];
    const wc = await getWebContentsFromIdOrThrow(this.webContentsId);

    if (observer.onClickItem) {
      subscriptions.push(
        this.contextMenuObservable
          .subscribe(({ event, action, args }) => {
            observer.onClickItem!({ event, action, args: args || [] });
          })
      );
    }

    if (observer.onShow) {
      subscriptions.push(
        subscribeToEvent(wc, 'context-menu', observer.onShow!)
      );
    }

    if (observer.onAskAutofillPopup) {
      subscriptions.push(
        subscribeToIPCMessage(wc, 'ask-autofill-popup', observer.onAskAutofillPopup!)
      );
    }

    const subscription = new ServiceSubscription(subscriptions, observer, this);

    wc.once('destroyed', () => {
      subscription.unsubscribe();
    });

    return subscription;
  }

  private subscribeClickItem(
    menu: ContextMenu | AutofillContextMenu,
    obs: Subject<IMenuServiceObserverOnClickItemParam>
  ) {
    fromEvent<IMenuServiceObserverOnClickItemParam>(menu, 'click-item', ({ event, action, args }) => ({ event, action, args }))
      .subscribe(obs);
  }
}
