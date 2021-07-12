import UrlRouter from '../../../app/urlrouter/URLRouter';

const fakeState = {};
const fakeManifestProvider = {};

describe('Url Router', () => {
  describe('Compare URL & scope(s)', () => {
    it('should match an identical URL and a scope', async () => {
      const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
      const url = 'https://correct.test';
      const scopes = ['https://correct.test'];

      const actual = urlRouter.searchScopes(url, scopes);
      expect(actual).toBeTruthy();
    });

    it('should not match a different URL and scopes', async () => {
      const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
      const url = 'https://correct.test';
      const scopes = ['https://wrong.test'];

      const actual = urlRouter.searchScopes(url, scopes);
      expect(actual).toBeFalsy();
    });

    it('should match an URL and a scope among many available scopes', () => {
      const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
      const url = 'https://correct.test';
      const scopes = ['http://bad.test', 'https://correct.test', 'https://not-the-same.test'];

      const actual = urlRouter.searchScopes(url, scopes);
      expect(actual).toBeTruthy();
    });

    describe('Subdomains and wildcards', () => {
      it('should match an URL with subdomain when a scope has a wildcard', async () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://hello.correct.test';
        const scopes = ['https://*.correct.test'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeTruthy();
      });

      it('should not match an URL without subdomain when scope has a wildcard', async () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://correct.test';
        const scopes = ['https://*.correct.test'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeFalsy();
      });
    });

    describe('Pathnames', () => {
      it('should match an URL with any pathname when the scope has none', () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://something.test/a/n/y';
        const scopes = ['https://something.test'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeTruthy();
      });

      it('should match an URL with a pathname covered by the scope pathname', () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://correct.test/a/b/c';
        const scopes = ['https://correct.test/a'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeTruthy();
      });

      it('should not match an URL with a pathname outside of the scope pathname', () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://something.test/a/c/d/e';
        const scopes = ['https://something.test/a/b'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeFalsy();
      });
    });
  });
});
