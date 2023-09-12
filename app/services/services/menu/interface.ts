import { ContextMenuContext } from '../../../context-menu';
import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

// Menu
export type IMenuServiceSetMenuItemBooleanParam = { 
  menuItemId: string, 
  value: boolean 
};

@service('menu')
export class MenuService extends ServiceBase implements RPC.Interface<MenuService> {
  // @ts-ignore
  setChecked(param: IMenuServiceSetMenuItemBooleanParam): Promise<void> { }
  // @ts-ignore
  setEnabled(param: IMenuServiceSetMenuItemBooleanParam): Promise<void> { }
  // @ts-ignore
  setVisible(param: IMenuServiceSetMenuItemBooleanParam): Promise<void> { }
  // @ts-ignore
  addObserver(observer: RPC.ObserverNode<IMenuServiceObserver>): Promise<RPC.Subscription> { }
}

export type IMenuServiceObserverOnClickItemParam = {
  event: Pick<Electron.KeyboardEvent, 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey' | 'triggeredByAccelerator'>,
  action: string,
  args: any[],
};

@service('menu')
export class MenuServiceObserver extends ServiceBase implements RPC.Interface<MenuServiceObserver> {
  // @ts-ignore
  onClickItem(param: IMenuServiceObserverOnClickItemParam): Promise<void> { }
  // @ts-ignore
  onGlobalBangShortcut(): Promise<void> { }
}

// ContextMenu

@service('context-menu')
export class ContextMenuServiceManager extends ServiceBase implements RPC.Interface<ContextMenuServiceManager> {
  // @ts-ignore
  create(param: { webcontentsId: number }): Promise<RPC.Node<ContextMenuService>> { }
}

@service('context-menu')
export class ContextMenuService extends ServiceBase implements RPC.Interface<ContextMenuService> {
  // @ts-ignore
  popup(param: { props: Electron.ContextMenuParams, context?: Exclude<ContextMenuContext, 'webContents'> }): Promise<void> { }
  // @ts-ignore
  popupAutofill(param: {}): Promise<void> { }
  // @ts-ignore
  addObserver(observer: RPC.ObserverNode<ContextMenuServiceObserver>): Promise<RPC.Subscription> { }
}

@service('context-menu')
export class ContextMenuServiceObserver extends ServiceBase implements RPC.Interface<ContextMenuServiceObserver> {
  // @ts-ignore
  onShow(props: Electron.ContextMenuParams): Promise<void> { }
  // @ts-ignore
  onAskAutofillPopup(props: any): Promise<void> { }
  // @ts-ignore
  onClickItem(param: IMenuServiceObserverOnClickItemParam): Promise<void> { }
}
