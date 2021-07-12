/* eslint-disable no-underscore-dangle */
import { Menu, shell } from 'electron';
import { EventEmitter } from 'events';
import { SHORTCUTS } from '../../../keyboard-shortcuts';
import { isDarwin } from '../../../utils/process';
import { serializedKeyboardEvent } from './helpers';

const openFaq = () => {
  shell.openExternal('https://intercom.help/station');
};

const openPrivacyPolicies = () => {
  shell.openExternal('https://intercom.help/station/data-and-privacy/station-privacy-policies');
};

export class BrowserXMenuManager extends EventEmitter {

  protected _menu: Electron.Menu;

  get menu() {
    if (!this._menu) {
      if (isDarwin) {
        this._menu = Menu.buildFromTemplate(this.darwinMenuTemplate as Electron.MenuItemConstructorOptions[]);
      } else {
        this._menu = Menu.buildFromTemplate(this.defaultMenuTemplate as Electron.MenuItemConstructorOptions[]);
      }
    }
    return this._menu;
  }

  getMenuItemFromShortcut(shortcutKey: string, addClick: boolean = false, addRole: boolean = false) {
    const emit = this.emit.bind(this);
    const { label, id, role, accelerator, disabled, visibleInMenu } = SHORTCUTS[shortcutKey];
    return Object.assign(
      {
        id,
        label,
        accelerator,
        visible: !disabled && visibleInMenu,
        enabled: !disabled,
      },
      addRole ? { role } : {},
      addClick ? {
        click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
          emit('click-item', { event: serializedKeyboardEvent(event), action: id }
          );
        },
      } : {});
  }

  getMainMenuTemplate() {
    const emit = this.emit.bind(this);

    return {
      label: 'Station',
      submenu: [
        {
          label: 'About Station',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'about' });
          },
        },
        {
          type: 'separator',
        },
        {
          ...this.getMenuItemFromShortcut('settings', true),
          label: 'Preferences...',
        },
        {
          type: 'separator',
        },
        {
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          ...this.getMenuItemFromShortcut('hide-station'),
          selector: 'hide:',
        },
        {
          ...this.getMenuItemFromShortcut('hide-others'),
          selector: 'hideOtherApplications:',
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:',
        },
        {
          type: 'separator',
        },
        this.getMenuItemFromShortcut('app-quit', true),
      ],
    };
  }

  getEditMenuTemplate() {
    return {
      label: 'Edit',
      submenu: [
        this.getMenuItemFromShortcut('undo', false, true),
        this.getMenuItemFromShortcut('redo', false, true),
        {
          type: 'separator',
        },
        this.getMenuItemFromShortcut('find', true),
        {
          type: 'separator',
        },
        this.getMenuItemFromShortcut('cut', false, true),
        this.getMenuItemFromShortcut('copy', false, true),
        this.getMenuItemFromShortcut('paste', false, true),
        this.getMenuItemFromShortcut('paste-and-match-style', true),
        this.getMenuItemFromShortcut('paste-and-match-style-hidden', true),
        this.getMenuItemFromShortcut('select-all', false, true),
        this.getMenuItemFromShortcut('copy-url-to-clipboard', true),
      ],
    };
  }

  getViewMenuTemplate() {
    const emit = this.emit.bind(this);

    return {
      label: 'View',
      submenu: [
        this.getMenuItemFromShortcut('bang', true),
        {
          type: 'separator',
        },
        this.getMenuItemFromShortcut('page-reload', true),
        this.getMenuItemFromShortcut('app-reload', true),
        {
          type: 'separator',
        },
        this.getMenuItemFromShortcut('page-reset-zoom', true),
        this.getMenuItemFromShortcut('page-zoom-in', true),
        this.getMenuItemFromShortcut('page-zoom-out', true),
        this.getMenuItemFromShortcut('full-screen', true),
        this.getMenuItemFromShortcut('detach-current-tab', true),
        this.getMenuItemFromShortcut('close-current-tab', true),
        {
          type: 'separator',
        },
        {
          label: 'Developer',
          submenu: [
            this.getMenuItemFromShortcut('page-devtools', true),
            this.getMenuItemFromShortcut('app-devtools', true),
            this.getMenuItemFromShortcut('worker-devtools', true),
          ],
        },
        {
          label: 'Open Process Manager',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'open-process-manager' });
          },
        },
      ],
    };
  }

  getHistoryTemplate() {
    return {
      label: 'History',
      submenu: [
        this.getMenuItemFromShortcut('page-go-back', true),
        this.getMenuItemFromShortcut('page-go-forward', true),
      ],
    };
  }

  getWindowMenuTemplate() {
    const emit = this.emit.bind(this);

    return {
      label: 'Window',
      submenu: [
        this.getMenuItemFromShortcut('minimize', false, true),
        {
          label: 'Close',
          selector: 'close',
        },
        {
          label: 'Reset Position',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'reset-window-position' });
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          selector: 'front',
        },
        this.getMenuItemFromShortcut('detach-current-tab', true),
      ],
    };
  }

  getHelpMenuTemplateWindows() {
    const emit = this.emit.bind(this);

    return {
      label: 'Help',
      submenu: [
        {
          label: 'About Station',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'about' });
          },
        },
        {
          type: 'separator',
        },
        this.getMenuItemFromShortcut('toggle-kbd-shortcuts', true),
        {
          label: 'FAQ',
          click() {
            openFaq();
          },
        },
        {
          label: 'What\'s new in Station',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'show-release-notes' });
          },
        },
        {
          label: 'Bugs && Features request',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'show-community' });
          },
        },
        {
          label: 'Discover Station\'s features',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'station-tour' });
          },
        },
        {
          type: 'separator',
        },
        {
          id: 'reset-current-application',
          label: 'Reset Current Application',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'reset-current-application' });
          },
        },
      ],
    };
  }

  getHelpMenuTemplateDarwin() {
    const emit = this.emit.bind(this);

    return {
      label: 'Help',
      submenu: [
        this.getMenuItemFromShortcut('toggle-kbd-shortcuts', true),
        {
          label: 'FAQ',
          click() {
            openFaq();
          },
        },
        {
          label: 'Bugs && Features request',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'show-community' });
          },
        },
        {
          label: 'Privacy policies',
          click() {
            openPrivacyPolicies();
          },
        },
        {
          label: 'What\'s new in Station',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'show-release-notes' });
          },
        },
        {
          label: 'Discover Station\'s features',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'station-tour' });
          },
        },
        {
          type: 'separator',
        },
        {
          id: 'reset-current-application',
          label: 'Reset Current Application',
          click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
            emit('click-item', { event: serializedKeyboardEvent(event), action: 'reset-current-application' });
          },
        },
      ],
    };
  }

  get darwinMenuTemplate() {
    return [
      this.getMainMenuTemplate(),
      this.getEditMenuTemplate(),
      this.getViewMenuTemplate(),
      this.getHistoryTemplate(),
      this.getWindowMenuTemplate(),
      this.getHelpMenuTemplateDarwin(),
    ];
  }

  getFileMenuTemplate() {
    return {
      label: '&File',
      submenu: [
        {
          ...this.getMenuItemFromShortcut('settings', true),
          label: 'Options...',
        },
        this.getMenuItemFromShortcut('app-quit', true),
      ],
    };
  }

  get defaultMenuTemplate() {
    return [
      this.getFileMenuTemplate(),
      this.getEditMenuTemplate(),
      this.getViewMenuTemplate(),
      this.getHistoryTemplate(),
      this.getHelpMenuTemplateWindows(),
    ];
  }
}
