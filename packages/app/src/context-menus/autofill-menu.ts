import {
  BrowserWindow,
  Menu,
} from 'electron';
import { EventEmitter } from 'events';
import * as uuid from 'uuid';
import { serializedKeyboardEvent } from '../services/services/menu/helpers';

interface PopupOptions {
  window: BrowserWindow,
  x: number,
  y: number,
}

// ⚠️ Because of https://github.com/electron/electron/issues/19424,
// we use a global reference to keep menus alive while they are open and
// prevent the garbage collection.
// See `popup()` for the uuid generation, saving the reference and deleting it afterward
const MENUS = new Map();

export default class AutofillContextMenu extends EventEmitter {
  private emails: [string];

  constructor(emails: [string]) {
    super();
    this.emails = emails;
  }

  /**
   * Build the menu template according to given emails.
   * @param emails List of strings to display in the menu
   */
  buildTemplate(emails: [string]) {
    const emit = this.emit.bind(this);
    return emails.map(v => ({
      label: v,
      click(_menuItem: Electron.MenuItem, _browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) {
        emit('click-item', { event: serializedKeyboardEvent(event), action: 'autofill-value-chosen', args: [v] });
      },
    }));
  }

  /**
   * Build the menu template then popup the menu.
   * Also generates an uuid and save the menu as a global reference,
   * then removes it when the menu closes.
   * See head of file for details.
   * @param options Various options to forward to menu.popup()
   */
  popup(options: PopupOptions) {
    const id = uuid.v4();

    const template = this.buildTemplate(this.emails);
    const menu = Menu.buildFromTemplate(template);

    // Save a global references to avoid garbage collection
    // ⚠️ See head of file for details
    MENUS.set(id, menu);

    menu.popup({
      ...options,
      // Remove global references when the menu closes
      callback: () => { MENUS.delete(id); },
    });
  }
}
