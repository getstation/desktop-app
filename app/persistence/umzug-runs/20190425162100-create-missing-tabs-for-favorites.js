/* eslint-disable no-unused-vars */

import * as shortid from 'shortid';
import { map, omit } from 'ramda';

const removeFavoriteIds = map(omit(['favoriteId']));

const createTabFromFavorite = (favorite) => ({
  ...favorite,
  tabId: `${favorite.applicationId}/${shortid.generate()}`,
  lastActivityAt: null,
  isApplicationHome: 0,
  createdAt: String(new Date()),
  updatedAt: String(new Date()),
});

const getUnlinkedFavorites = async (query) => {
  const [favorites] = await query.sequelize.query(`
      SELECT "favoriteId", "applicationId", "favicons", "title", "url" FROM "favorite"
      WHERE "tabId"='' OR "tabId" IS NULL OR "tabId"='undefined'
    `, { raw: true });
  return favorites;
};

const updateFavoritesTabIds = async (query, tabs) => {
  const queries = [];

  for (const tab of tabs) {
    queries.push(query.sequelize.query(`
        UPDATE "favorite"
        SET "tabId"='${tab.tabId}'
        WHERE "favoriteId"='${tab.favoriteId}'
      `, { raw: true }));
  }

  await Promise.all(queries);
};

export default {
  async up(query, DataTypes) {
    const favorites = await getUnlinkedFavorites(query);
    const tabs = favorites.map(createTabFromFavorite);

    if (!tabs.length) return;

    await query.bulkInsert('tab', removeFavoriteIds(tabs));
    await updateFavoritesTabIds(query, tabs);
  },

  async down(query, DataTypes) {
    return null;
  }
};
