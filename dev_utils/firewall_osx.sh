#!/usr/bin/env bash

# need install install coreutils
# $ brew install coreutils

DEVUTILDIR="$( dirname "$0" )"
BASEDIR="$DEVUTILDIR/.."
ELECTRONPREBUILTPATH=$(grealpath "$BASEDIR/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron")

# temporarily shut firewall off:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# put Electron prebuilt as an exception:
/usr/libexec/ApplicationFirewall/socketfilterfw --add "$ELECTRONPREBUILTPATH"

# re-enable firewall:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
