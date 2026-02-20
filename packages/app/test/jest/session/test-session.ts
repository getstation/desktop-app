import { getUserAgentForApp } from '../../../src/session';

describe('session user agent', () => {
  const currentUserAgent = 'Current-UA';

  it('returns default chromium user-agent for regular https URLs', () => {
    const ua = getUserAgentForApp('https://messages.google.com/web/', currentUserAgent);
    expect(ua).toContain('Mozilla/5.0');
    expect(ua).toContain('Chrome/');
    expect(ua).toContain('Safari/537.36');
  });

  it('returns full user-agent for accounts.google.com', () => {
    const ua = getUserAgentForApp('https://accounts.google.com/ServiceLogin', currentUserAgent);
    expect(ua).toContain('Mozilla/5.0');
    expect(ua).toContain('Chrome/');
    expect(ua).toContain('Safari/537.36');
  });

  it('returns current user-agent for file:// URLs', () => {
    expect(getUserAgentForApp('file:///tmp/index.html', currentUserAgent)).toBe(currentUserAgent);
  });

  it('returns current user-agent for localhost URLs', () => {
    expect(getUserAgentForApp('http://localhost:3000', currentUserAgent)).toBe(currentUserAgent);
  });
});
