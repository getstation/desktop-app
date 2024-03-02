#!/usr/bin/env bash
echo "Starting electron-mocha tests"
set -e
export TS_NODE_FILES=true
echo "electron-mocha: SDK"
xvfb-maybe electron-mocha --require-main test/electron-mocha/sdk/ipc/main-loader --renderer test/electron-mocha/sdk/ipc/renderer-loader
if [[ $TRAVIS_OS_NAME != 'linux' ]]; then echo "electron-mocha: URLRouter"; xvfb-maybe electron-mocha test/electron-mocha/urlrouter/main-loader --no-timeouts; fi
echo "electron-mocha: Services"
xvfb-maybe electron-mocha --require-main test/electron-mocha/services/main-loader --renderer test/electron-mocha/services/renderer-loader
