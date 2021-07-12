import { EnumValues } from 'enum-values';
import * as memoize from 'memoizee';
import { isPackaged } from './utils/env';
import { isDarwin } from './utils/process';

export enum CATEGORY {
  GENERAL = 'General',
  SWITCH = 'Applications switching',
  PAGE = 'Page',
  WINDOWS = 'Windows',
  EDITION = 'Edit',
  GLOBAL = 'Global',
}

export const CATEGORIES = EnumValues.getValues<CATEGORY>(CATEGORY);

export type KeyboardShortcut = {
  label: string,
  accelerator: string | string[],
  role?: string,
  id: string,
  kbd: string,
  category: CATEGORY,
  disabled?: boolean,
  /**
   * Will not display the item in the `Menu`. But the shortcuts still works.
   * Default: true
   */
  visibleInMenu?: boolean,
  /**
   * If true, the shortcut will not appear in the Shortcuts Overlay
   * that summarizes available shortcuts to the user.
   * By default: false.
   */
  doNotShowInShortcutsOverlay?: boolean,
};

export const SHORTCUTS = <{ [key: string]: KeyboardShortcut }>{
  settings: <KeyboardShortcut>{
    id: 'settings',
    accelerator: 'CmdOrCtrl+,',
    kbd: isDarwin ? '⌘ ,' : 'CTRL ,',
    label: 'Preferences',
    category: CATEGORY.WINDOWS,
  },
  'hide-station': <KeyboardShortcut>{
    id: 'hide-station',
    accelerator: 'Command+H',
    kbd: '⌘ H',
    label: 'Hide Station',
    category: CATEGORY.WINDOWS,
    disabled: !isDarwin,
  },
  'hide-others': <KeyboardShortcut>{
    id: 'hide-others',
    accelerator: 'Command+Shift+H',
    kbd: '⌘ ⇧ H',
    label: 'Hide others',
    category: CATEGORY.WINDOWS,
    disabled: !isDarwin,
  },
  'app-quit': <KeyboardShortcut>{
    id: 'app-quit',
    accelerator: isDarwin ? 'Command+Q' : 'Alt+F4',
    kbd: isDarwin ? '⌘ Q' : 'ALT F4',
    label: 'Quit',
    category: CATEGORY.WINDOWS,
  },
  undo: <KeyboardShortcut>{
    id: 'undo',
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    kbd: isDarwin ? '⌘ Z' : 'CTRL Z',
    role: 'undo',
    category: CATEGORY.EDITION,
  },
  redo: <KeyboardShortcut>{
    id: 'redo',
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    kbd: isDarwin ? '⌘ ⇧ Z' : 'CTRL ⇧ Z',
    role: 'redo',
    category: CATEGORY.EDITION,
  },
  find: <KeyboardShortcut>{
    id: 'find',
    label: 'Find in page',
    accelerator: 'CmdOrCtrl+F',
    kbd: isDarwin ? '⌘ F' : 'CTRL F',
    category: CATEGORY.WINDOWS,
  },
  cut: <KeyboardShortcut>{
    id: 'cut',
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    kbd: isDarwin ? '⌘ X' : 'CTRL X',
    role: 'cut',
    category: CATEGORY.EDITION,
  },
  copy: <KeyboardShortcut>{
    id: 'copy',
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    kbd: isDarwin ? '⌘ C' : 'CTRL C',
    role: 'copy',
    category: CATEGORY.EDITION,
  },
  paste: <KeyboardShortcut>{
    id: 'paste',
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    kbd: isDarwin ? '⌘ V' : 'CTRL V',
    role: 'paste',
    category: CATEGORY.EDITION,
  },
  'paste-and-match-style': <KeyboardShortcut>{
    id: 'paste-and-match-style',
    label: 'Paste and Match Style',
    accelerator: 'Option+CmdOrCtrl+Shift+V',
    kbd: isDarwin ? '⌥ ⇧ ⌘ V' : 'CTRL ⇧ V',
    // Electron implementation does not work
    // ref: electron/electron#15896 (on issue solved, revert https://github.com/getstation/browserX/pull/887)
    // role: 'pasteandmatchstyle',
    category: CATEGORY.EDITION,
  },
  'paste-and-match-style-hidden': <KeyboardShortcut>{
    id: 'paste-and-match-style-hidden',
    label: 'Paste and Match Style',
    accelerator: 'CmdOrCtrl+Shift+V',
    // in Chrome, both shortcuts are registered: `CmdOrCtrl+Shift+V` and `Option+CmdOrCtrl+Shift+V`
    visibleInMenu: false,
    doNotShowInShortcutsOverlay: true,
    kbd: isDarwin ? '⇧ ⌘ V' : 'CTRL ⇧ V',
    // see above
    // role: 'pasteandmatchstyle',
    category: CATEGORY.EDITION,
  },
  'select-all': <KeyboardShortcut>{
    id: 'select-all',
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    kbd: isDarwin ? '⌘ A' : 'CTRL A',
    role: 'selectall',
    category: CATEGORY.EDITION,
  },
  bang: <KeyboardShortcut>{
    id: 'bang',
    label: 'Show Quick-Switch',
    accelerator: 'CmdOrCtrl+T',
    kbd: isDarwin ? '⌘ T' : 'CTRL T',
    category: CATEGORY.GENERAL,
  },
  'toggle-kbd-shortcuts': <KeyboardShortcut>{
    id: 'toggle-kbd-shortcuts',
    label: 'Keyboard shortcuts',
    accelerator: 'Ctrl+H',
    kbd: 'CTRL H',
    category: CATEGORY.GENERAL,
  },
  'page-reload': <KeyboardShortcut>{
    id: 'page-reload',
    label: 'Reload This Page',
    accelerator: 'CmdOrCtrl+R',
    kbd: isDarwin ? '⌘ R' : 'CTRL R',
    category: CATEGORY.PAGE,
  },
  'app-reload': <KeyboardShortcut>{
    id: 'app-reload',
    label: 'Reload Whole App',
    accelerator: 'CmdOrCtrl+Shift+R',
    kbd: isDarwin ? '⌘ ⇧ R' : 'CTRL ⇧ R',
    disabled: isPackaged,
    category: CATEGORY.GENERAL,
  },
  'copy-url-to-clipboard': <KeyboardShortcut>{
    id: 'copy-url-to-clipboard',
    label: 'Copy Current Page\'s URL',
    accelerator: 'CmdOrCtrl+Shift+U',
    kbd: isDarwin ? '⌘ ⇧ U' : 'CTRL ⇧ U',
    category: CATEGORY.PAGE,
  },
  'page-reset-zoom': <KeyboardShortcut>{
    id: 'page-reset-zoom',
    label: 'Reset Zoom',
    accelerator: 'CmdOrCtrl+0',
    kbd: isDarwin ? '⌘ 0' : 'CTRL 0',
    category: CATEGORY.PAGE,
  },
  'page-zoom-in': <KeyboardShortcut>{
    id: 'page-zoom-in',
    label: 'Zoom In',
    accelerator: 'CmdOrCtrl+Plus',
    kbd: isDarwin ? '⌘ +' : 'CTRL +',
    category: CATEGORY.PAGE,
  },
  'page-zoom-out': <KeyboardShortcut>{
    id: 'page-zoom-out',
    label: 'Zoom Out',
    accelerator: 'CmdOrCtrl+-',
    kbd: isDarwin ? '⌘ -' : 'CTRL -',
    category: CATEGORY.PAGE,
  },
  'full-screen': <KeyboardShortcut>{
    id: 'full-screen',
    label: 'Toggle Full Screen',
    accelerator: isDarwin ? 'Ctrl+Command+F' : 'F11',
    kbd: isDarwin ? '⌘ CTRL F' : 'F11',
    category: CATEGORY.WINDOWS,
  },
  'detach-current-tab': <KeyboardShortcut>{
    id: 'detach-current-tab',
    label: 'Detach Current Application',
    accelerator: 'Alt+Shift+X',
    kbd: 'ALT ⇧ X',
    category: CATEGORY.WINDOWS,
  },
  'close-current-tab': <KeyboardShortcut>{
    id: 'close-current-tab',
    label: 'Close Current Page',
    accelerator: 'CmdOrCtrl+W',
    kbd: isDarwin ? '⌘ W' : 'CTRL W',
    category: CATEGORY.WINDOWS,
  },
  'page-devtools': <KeyboardShortcut>{
    id: 'page-devtools',
    label: 'Toggle Page Developer Tools',
    accelerator: 'Alt+CmdOrCtrl+I',
    kbd: isDarwin ? '⌘ ALT I' : 'CTRL ALT I',
    category: CATEGORY.PAGE,
  },
  'app-devtools': <KeyboardShortcut>{
    id: 'app-devtools',
    label: 'Toggle Station Developer Tools',
    accelerator: 'Alt+Shift+CmdOrCtrl+I',
    kbd: isDarwin ? '⌘ ALT ⇧ I' : 'CTRL ALT ⇧ I',
    category: CATEGORY.PAGE,
  },
  'worker-devtools': <KeyboardShortcut>{
    id: 'worker-devtools',
    label: 'Toggle Worker Developer Tools',
    category: CATEGORY.PAGE,
  },
  'page-go-back': <KeyboardShortcut>{
    id: 'page-go-back',
    label: 'Back',
    accelerator: 'CmdOrCtrl+[',
    kbd: isDarwin ? '⌘ [' : 'CTRL [',
    category: CATEGORY.PAGE,
  },
  'page-go-forward': <KeyboardShortcut>{
    id: 'page-go-forward',
    label: 'Forward',
    accelerator: 'CmdOrCtrl+]',
    kbd: isDarwin ? '⌘ ]' : 'CTRL ]',
    category: CATEGORY.PAGE,
  },
  minimize: <KeyboardShortcut>{
    id: 'minimize',
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    kbd: isDarwin ? '⌘ M' : 'CTRL M',
    role: 'minimize',
    category: CATEGORY.WINDOWS,
    disabled: !isDarwin,
  },
  'global-bang': <KeyboardShortcut>{
    id: 'global-bang',
    label: 'Show Search',
    accelerator: 'Alt+Shift+Space',
    kbd: 'ALT ⇧ ␣',
    category: CATEGORY.GLOBAL,
  },
  'go-sibling-app': <KeyboardShortcut>{
    id: 'go-sibling-app',
    label: 'Go to previous/next application',
    accelerator: ['mod+alt+left', 'mod+alt+right'],
    kbd: isDarwin ? '⌘ ALT ←/→' : 'CTRL ALT ←/→',
    category: CATEGORY.SWITCH,
  },
  'go-previous-app': <KeyboardShortcut>{
    id: 'go-previous-app',
    label: 'Switch to previously used',
    accelerator: 'ctrl+tab',
    kbd: 'CTRL ⇥',
    category: CATEGORY.SWITCH,
  },
  'cycle-app': <KeyboardShortcut>{
    id: 'cycle-app',
    label: 'Cycle through previously used',
    accelerator: 'ctrl+tab',
    kbd: 'hold CTRL then hit ⇥',
    category: CATEGORY.SWITCH,
  },
  'cycle-app-reverse': <KeyboardShortcut>{
    id: 'cycle-app-reverse',
    doNotShowInShortcutsOverlay: true,
    label: 'Reverse cycle through previously used',
    accelerator: 'ctrl+shift+tab',
    kbd: 'hold CTRL ⇧ then hit ⇥',
    category: CATEGORY.SWITCH,
  },
  'go-app-num': <KeyboardShortcut>{
    id: 'go-app-num',
    label: 'Go to application at position num',
    accelerator: ['mod+1', 'mod+2', 'mod+3', 'mod+4', 'mod+5', 'mod+6', 'mod+7', 'mod+8', 'mod+9'],
    kbd: isDarwin ? '⌘ [1-9]' : 'CTRL [1-9]',
    category: CATEGORY.SWITCH,
  },
};

export const getShortcutsByCategory = memoize((category: CATEGORY): KeyboardShortcut[] => {
  return Object
    .keys(SHORTCUTS)
    .map(key => SHORTCUTS[key])
    .filter(val => val.category === category);
});
