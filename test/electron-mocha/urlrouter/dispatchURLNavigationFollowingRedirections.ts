import * as assert from 'assert';
import { join } from 'path';
import { app } from 'electron';
import { runSaga } from 'redux-saga';
import { dispatchUrlSaga } from '../../../app/urlrouter/sagas';
import { getState } from './data-mock';
import { addDummyCookieToSession, removeDummyCookieFromSession } from './electron-mock';
import { startDummyServer } from './server-mock';
import ManifestProvider from '../../../app/applications/manifest-provider/manifest-provider';
import URLRouter from '../../../app/urlrouter/URLRouter';

const manifestProvider = new ManifestProvider({
  cachePath: join(app.getPath('userData'), 'ApplicationManifestsCache'),
});

const context = {
  bxApp: {
    router: new URLRouter(getState, manifestProvider),
  },
};

let dispatcher;

describe('URL Router Follow Redirects', () => {

  beforeEach(() => {
    dispatcher = dispatchUrlSaga;
    removeDummyCookieFromSession();
  });

  it('Dispatch shortened URL with cookie forwarding should permit access to a secured resource', async () => {
    addDummyCookieToSession();
    const server = startDummyServer();

    const shortenedUrl = 'http://localhost:4444/redirectme';

    const { url, action } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: shortenedUrl })
      .toPromise();

    server.stop();

    assert.equal(action, 'NAV_TO_TAB');
    assert.equal(url, 'http://localhost:4444/secure');
  });

  it('Dispatch shortened URL without cookie forwarding should not permit access to a secured resource', async () => {
    const server = startDummyServer();

    const shortenedUrl = 'http://localhost:4444/redirectme';

    const { url, action } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: shortenedUrl })
      .toPromise();

    server.stop();

    assert.equal(action, 'DEFAULT_BROWSER');
    assert.equal(url, shortenedUrl);
  });

  it('Dispatch shortened URL with cookie forwarding should open in default browser after more than 19 redirects', async () => {
    addDummyCookieToSession();
    const server = startDummyServer();

    const shortenedUrl = 'http://localhost:4444/redirectme-infinite-loop';

    const { url, action } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: shortenedUrl })
      .toPromise();

    server.stop();

    assert.equal(action, 'DEFAULT_BROWSER');
    assert.equal(url, shortenedUrl);
  });

  it('Dispatch bit.ly URL that contain a github repo should open github app with a new tab', async () => {
    const bitlyUrlForGithub = 'https://bit.ly/2rlmr6H';

    const { url, action, destination } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: bitlyUrlForGithub })
      .toPromise();

    assert.equal(action, 'NEW_TAB');
    assert.equal(destination.applicationId, 'github-S1PwoQsDG');
    assert.equal(url, 'https://github.com/follow-redirects/follow-redirects');
  });

  it('Dispatch Slack redirect URL that contain getstation.com should open Station Website app with in the current tab', async () => {
    const googleUrlForStationWebsite = 'https://slack-redir.net/link?url=https://getstation.com';

    const { url, action, destination } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: googleUrlForStationWebsite })
      .toPromise();

    assert.equal(action, 'NAV_TO_TAB');
    assert.equal(destination.tabId, 'getstation-app-1/getstation-tab-1');
    assert.equal(url, 'https://getstation.com/');
  });

  it('Dispatch git.io redirect URL that contain a github link should open github app with a new tab', async () => {
    const gitIoLink = 'https://git.io/vFLqM';

    const { url, action, destination } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: gitIoLink })
      .toPromise();

    assert.equal(action, 'NEW_TAB');
    assert.equal(destination.applicationId, 'github-S1PwoQsDG');
    assert.equal(url, 'https://github.com/marketplace');
  });

  it('Dispatch t.co URL that contain a random website shoulds open default browser', async () => {
    const twitterUrlForRandomSite = 'https://t.co/OdWltHhFxT';

    const { url, action } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: twitterUrlForRandomSite })
      .toPromise();

    assert.equal(action, 'DEFAULT_BROWSER');
    assert.equal(url, twitterUrlForRandomSite);
  });

  it('Dispatch Slack redirect URL that contain a random website shoulds open default browser', async () => {
    const slackUrlForRandomSite = 'https://slack-redir.net/link?url=http%3A%2F%2Fwww.lalibre.be%2Feconomie%2Flibre-entreprise%2' +
      'Fstation-dernier-ne-d-efounders-leve-3-25-millions-de-dollars-5ae89871cd702e6325018f8d';

    const { url, action } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: slackUrlForRandomSite })
      .toPromise();

    assert.equal(action, 'DEFAULT_BROWSER');
    assert.equal(url, slackUrlForRandomSite);
  });

  it('Dispatch non shortened url should open existing tab', async () => {
    const googleUrlForAppearIn = 'https://docs.google.com/document/d/1UuS6ff4Fd4igZgL50LDS8MeROVrOfkN13RbiP2nTT9I/edit';

    const { url, action, destination } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: googleUrlForAppearIn })
      .toPromise();

    assert.equal(action, 'NAV_TO_TAB');
    assert.equal(destination.tabId, 'gdrive-mu-BJZ3JYXiPf/Ml3CcWibN');
    assert.equal(url, 'https://docs.google.com/document/d/1UuS6ff4Fd4igZgL50LDS8MeROVrOfkN13RbiP2nTT9I/edit');
  });
});
