# Station Desktop Application

## Table of Contents
- [Installation](#installation)
  - [Requirements](#requirements)
  - [MacOS](#macos)
  - [Windows](#windows)
  - [Ubuntu](#ubuntu)
  - [CentOS / Amazon Linux 2](#centos-or-amazon-linux-2)
- [Run](#run)
- [DevTools](#devtools)
  - [Toggle Chrome DevTools](#toggle-chrome-devtools)
  - [Library DevTools](#library-devtools)
    - [Redux DevTools](#redux-devtools)
  - [Main proces debugging](#main-proces-debugging)
  - [Debugging in VSCode](#debugging-in-vscode)
- [Useful env variables for dev](#useful-env-variables-for-dev)
- [Migrations](#migrations)
  - [Inspect DB](#inspect-db)
- [Packaging](#packaging)
  - [Code signing](#code-signing)
- [Development tools](#development-tools)
- [Releases](#releases)
- [Documentations](#documentations)

## Installation

### Requirements
* node >= `18.x`
* yarn >= `1.19.x`

```bash
$ git clone https://github.com/getstation/desktop-app.git
$ cd desktop-app
$ yarn
```

### MacOS

No additional requirements.

### Windows

Install `node-gyp` dependencies

```bash
$ npm --add-python-to-path install --global --production windows-build-tools
```

### Ubuntu

```bash
$ sudo apt install graphicsmagick icnsutils libxtst-dev libx11-dev libxrender-dev libxkbfile-dev libgconf-2-4
```

### CentOS or Amazon Linux 2

CentOS 9 is required.

```bash
$ sudo yum install clang dbus-devel gtk3-devel libnotify-devel xorg-x11-server-utils libcap-devel \
                   cups-devel libXtst-devel alsa-lib-devel libXrandr-devel nss-devel
```

> See [dotenv](#dotenv) for further configuration.

## Run
```bash
yarn run dev
```

### Natives modules errors 

If for any reason you have some error with binding module you could run `npm run rebuild-all-native` to check if you still have the problem

## DevTools

### Toggle Chrome DevTools

- MacOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

### Library DevTools
- [React DevTools](https://github.com/facebook/react-devtools) is available in Chrome DevTools
- [Apollo Client DevTools](https://github.com/apollographql/apollo-client-devtools) is available in Chrome DevTools
- [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) see below

#### Redux Devtools
In order to see redux transactions and state,
install [Redux DevTools](https://github.com/gaearon/redux-devtools) 
(or the [browser extension](https://github.com/zalmoxisus/redux-devtools-extension))
and click on `Open Remote DevTools`. Make sure `Use (custom) local server` on `localhost:8000` is activated in the settings.

### Main proces debugging
To inspect the main process, connect Chrome by visiting `chrome://inspect` and selecting to inspect the launched Electron app.

## Useful env variables for dev
- `STATION_NO_WEBVIEWS` if exists, webviews are not loaded
- `STATION_REDUX_LOGGER` if exists, will enable redux-logger in renderer
- `STATION_AUTOUPDATER_MOCK_SCENARIO` set the scenario for the mock of `AutoUpdater` module:
  - `available` (default), mock an update is available and downloaded
  - `not-available` mock an update is not available
- `OVERRIDE_USER_DATA_PATH` override `userData` path (example: `OVERRIDE_USER_DATA_PATH="Station Canary" yarn run dev`)
- `STATION_CHECK_INACTIVE_TAB_EVERY_MS` override the interval period between each check for inactive tabs
- `STATION_WAIT_MS_BEFORE_KILL_TAB` override the time to wait before considering a tab is inactive and killing it
- `STATION_QUICK_TRANSITIONS` all transitions are quick (used to test changing colors)
- `STATION_REACT_PERF` add the react-addons-perf for react perf debugging
- `STATION_NO_CHECK_FOR_UPDATE` if exists, the app will not check for update
- `DEBUG=service:*` Will print debug info of Service framework on all processes
- `STATION_SHOW_REQUIRE_TIME` if exists, the app will display the execution time of requiring modules upon quit
  - ~~Main: timers shown upon quit~~ (disabled for now)
  - ~~Renderer: to show timers, execute this in a console: `require('@getstation/time-require').default()`~~  (disabled for now)
- `STATION_DISABLE_ECX` if exists, `electron-chrome-extension` will not be loaded

## Migrations

Databases migrations are using [umzug](https://github.com/sequelize/umzug) and [umzug-cli](https://github.com/marcbachmann/umzug-cli).

To test migrations manually:
```bash
// Apply migrations
$ yarn run database migrations up
// Revert last applied migration
$ yarn run database migrations down
```

### Inspect DB
Install [TablePlus](https://tableplus.io/) and create a new SQLite connection with the database file located at `~/Library/Application\ Support/Station\ Dev/db/station.db`

## Manual Packaging

To package apps for the local platform:

```bash
$ yarn run build
```

#### Code signing
The application will be automatically signed by the CI on the `release` branch

## Development tools

Here is a list of tools used during the development process. Consider adding the corresponding plugins to your IDE.

- [Editorconfig](http://editorconfig.org/#download)
- [ESLint](http://eslint.org/docs/user-guide/integrations#editors)
- [TSLint](https://github.com/palantir/tslint)

WebStorm and VSCode should be correctly configured by default.

## Workspace management (TODO)
This repository should be used as a proper monorepo. Packages that should be impacted:
- appstore (already in this repo but not handled by any monorepo tool yet)
- @getstation/sdk
- @getstation/theme

## Releases

1. [Draft a new release](https://github.com/getstation/desktop-app/releases/new) tagged with the desired version
2. Apply your changes on [`release`](https://github.com/getstation/desktop-app/tree/release) branch
3. On `release` branch, bump the version with `yarn version` to the corresponding version number
4. Let the CI build artifacts for each platform
5. Publish the draft

Note: you can remove artifacts and push changes over the same draft

## Documentations
- [Services](app/services/README.md)
- [Score Engine](app/lib/score-engine/README.md)
- [Bang Lifecyle](app/bang/README.md)
- [Persistence](docs/persistence.md)
- [Webpack](docs/webpack.md)
- [Test Auto-Update](test/auto-update/how_to_test.md)
- [Local GraphQL](app/graphql/README.md)
