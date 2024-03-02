import * as Immutable from 'immutable';
import { MapStateProxy } from '../../../app/persistence/backend';
import { FavoriteProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const favorite1 = Immutable.Map({
  'favorite-B1MSOEBmZ': Immutable.Map({
    favoriteId: 'favorite-B1MSOEBmZ',
    favicons: Immutable.List(['https://ssl.gstatic.com/docs/presentations/images/favicon4.ico']),
    title: 'Station - Story Telling - Google Slides',
    url: 'https://docs.google.com/presentation/d/1tV0vPQjAgH0-5yfTEjHqQfMd5aqrsOVus8YF7OMDnGk/edit#slide=id.g222c7f6cfd_0_0',
    applicationId: 'gdrive-mu-B1xYEdaCMb'
  })
});

const favorite2 = Immutable.Map({
  'favorite-B1uHuVB7b': Immutable.Map({
    favoriteId: 'favorite-B1uHuVB7b',
    favicons: Immutable.List(['https://ssl.gstatic.com/docs/documents/images/kix-favicon6.ico']),
    title: 'Station - White Paper - Google Docs',
    url: 'https://docs.google.com/document/d/12K0zPVHWJmiw2C3Lh-h4nbWLJtoTmDb9AFrmfrsPNzk/edit',
    applicationId: 'gdrive-mu-B1xYEdaCMb'
  })
});

const favorite2Bis = Immutable.Map({
  'favorite-B1uHuVB7b': Immutable.Map({
    favoriteId: 'favorite-B1uHuVB7b',
    favicons: Immutable.List(['https://ssl.gstatic.com/docs/documents/images/kix-favicon6.ico']),
    title: 'Station - White Paper - Google Docs test',
    url: 'https://docs.google.com/document/d/12K0zPVHWJmiw2C3Lh-h4nbWLJtoTmDb9AFrmfrsPNzk/edit',
    applicationId: 'gdrive-mu-B1xYEdaCMc'
  })
});

const bothFavorites = favorite1.merge(favorite2);

beforeAll(() => umzug.up());

const proxy = new MapStateProxy(FavoriteProxy);

test('db has no favorites', () => proxy.get()
  .then(favs => {
    expect(favs.size === 0).toBe(true);
  }));

test('contains state with 1 favorite', () => proxy.set(favorite1)
  .then(() => proxy.get())
  .then(favs => {
    expect(favorite1.toJS()).toEqual(favs.toJS());
  }));

test('update with sames values', () => proxy.set(favorite1)
  .then(() => proxy.get())
  .then(favs => {
    expect(favorite1.toJS()).toEqual(favs.toJS());
  }));

test('add one favorite', () => proxy.set(bothFavorites)
  .then(() => proxy.get())
  .then(favs => {
    expect(bothFavorites.toJS()).toEqual(favs.toJS());
  }));

test('delete one favorite', () => proxy.set(favorite2)
  .then(() => proxy.get())
  .then(favs => {
    expect(favorite2.toJS()).toEqual(favs.toJS());
  }));

test('update one favorite', () => proxy.set(favorite2Bis)
  .then(() => proxy.get())
  .then(favs => {
    expect(favorite2Bis.toJS()).toEqual(favs.toJS());
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(favs => {
      expect(favorite2Bis.toJS()).toEqual(favs.toJS());
    });
});
