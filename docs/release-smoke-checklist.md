# Release Smoke Checklist

Use this checklist before publishing release candidates and production releases.

## Preconditions

1. Run `yarn install --immutable`.
2. Run `yarn pre-release:check`.
3. Confirm release tag and changelog are correct.

## Core Runtime

1. Open About window and verify:
`Electron` version matches intended release.
`Chromium` version is shown and not empty.
2. Open DevTools in one app and run `navigator.userAgent`.
3. Confirm UA includes the same Chromium version shown in About.

## Google Auth and Webview Routing

1. Open a Google app that uses `accounts.google.com` flow.
2. Confirm login page loads and redirects to expected Google sign-in route.
3. Confirm app tab remains attached (no blank webview/no crash).

## Sensitive Services

1. Open Android Messages (`messages.google.com`) and verify initial page load.
2. Open YouTube Music (`music.youtube.com`) and verify initial page load.
3. Open Google News (`news.google.com`) and verify redirect to home works.

## Stability Signals

1. Reload each tested app once.
2. Open and close DevTools on one tested app.
3. Confirm no persistent loading spinner and no repeated auth loop.

## Exit Criteria

1. No blocking error in tested flows.
2. No unexpected UA downgrade/hardcoded old Chrome version.
3. Pre-release checks and critical test suite pass.
