#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[pre-release-check] Environment"
echo "node: $(node -v)"
echo "yarn: $(yarn -v)"
echo "electron: $(node -e "console.log(require('./packages/app/package.json').devDependencies.electron)")"

if [[ "${CI:-}" == "true" ]] && [[ "$(uname -s)" == "Linux" ]]; then
  export ELECTRON_DISABLE_SANDBOX=1
  export ELECTRON_NO_SANDBOX=1
  echo "[pre-release-check] Linux CI detected: running Electron tests with sandbox disabled"
fi

echo "[pre-release-check] Running critical stability tests"
yarn workspace station-desktop-app test \
  test/jest/session/test-session.ts \
  test/jest/tab-webcontents/test-webcontents-to-kill.ts \
  test/jest/url-router/test-url-router.ts

echo "[pre-release-check] Checking for known risky hardcodes"
if rg -n "bx_override_user_agent" packages/app/manifests/definitions; then
  echo "[pre-release-check] ERROR: Found bx_override_user_agent in manifests."
  exit 1
fi

if rg -n "Chrome/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+" \
  packages/app/src/session.ts \
  packages/app/manifests/definitions; then
  echo "[pre-release-check] ERROR: Found hardcoded Chrome version."
  exit 1
fi

if rg -n "targets:\s*\{\s*electron:\s*'?[0-9]+'?\s*\}" packages/app/webpack.config.base.js; then
  echo "[pre-release-check] ERROR: Found hardcoded webpack Electron target."
  exit 1
fi

echo "[pre-release-check] Verifying About window exposes runtime versions"
if ! rg -n "process\\.versions\\.electron|process\\.versions\\.chrome" \
  packages/app/src/about-window/components/AboutWindowVersions.tsx >/dev/null; then
  echo "[pre-release-check] ERROR: About window does not expose Electron/Chromium versions."
  exit 1
fi

echo "[pre-release-check] OK"
