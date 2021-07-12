// See https://github.com/electron/electron/blob/b92163d2260dcee8dfef531a9fb837b6d372e060/lib/renderer/init.ts
import { ipcRendererInternal } from '../../../lib/ipc-renderer-internal';

const { hasSwitch, getSwitchValue } = (process as any).electronBinding('command_line');

const parseOption = <T>(
  name: string, defaultValue: T, converter?: (value: string) => T
) => {
  return hasSwitch(name)
    ? (
      converter
        ? converter(getSwitchValue(name))
        : getSwitchValue(name)
    )
    : defaultValue;
};

const guestInstanceId = parseOption('guest-instance-id', null, value => parseInt(value, 10));
const openerId = parseOption('opener-id', null, value => parseInt(value, 10));
const isHiddenPage = hasSwitch('hidden-page');
const usesNativeWindowOpen = hasSwitch('native-window-open');

// Any URL that shouldn't be loaded as `nativeWindowOpen` as a popup
// should appear here if parent window uses `nativeWindowOpen`
const overrideNativeWindowOpenList = [
  'app.mixmax.com/_oauth/google',
];

require('./window-setup').default(
  ipcRendererInternal, guestInstanceId, openerId, isHiddenPage, usesNativeWindowOpen, overrideNativeWindowOpenList
);
