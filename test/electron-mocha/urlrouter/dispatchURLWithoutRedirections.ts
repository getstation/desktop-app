import { app } from 'electron';
import { join } from 'path';
import * as assert from 'assert';
import { runSaga } from 'redux-saga';
import { dispatchUrlSaga } from '../../../app/urlrouter/sagas';
import { getState } from './data-mock';
import ManifestProvider from '../../../app/applications/manifest-provider/manifest-provider';
import { BrowserXAppWorker } from '../../../app/app-worker';
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

describe('URL Router Dispatcher', () => {

  beforeEach(async () => {
    dispatcher = dispatchUrlSaga;
  });

  it('Dispatch linkedin.com should navigate to the corresponding open app tab', async () => {
    const linkToRedirect = 'https://www.linkedin.com/';

    const { url, action, destination } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: linkToRedirect }, { }, {})
      .toPromise();

    assert.equal(action, 'NAV_TO_TAB');
    assert.equal(destination.tabId, 'linkedIn-SJYMzYu6M/BJeYzft_6f');
    assert.equal(url, 'https://www.linkedin.com/');
  });
});
