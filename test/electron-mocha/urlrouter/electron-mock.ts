import { session } from 'electron';

export const addDummyCookieToSession = () =>
  session.defaultSession!.cookies.set({ url: 'http://localhost:4444/', name: 'dummy_name', value: 'dummy' }, () => {});

export const removeDummyCookieFromSession = () =>
  session.defaultSession!.cookies.remove('http://localhost:4444/', 'dummy_name', () => {});
