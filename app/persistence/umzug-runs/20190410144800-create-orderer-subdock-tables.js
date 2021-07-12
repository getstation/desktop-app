/* eslint-disable no-unused-vars */

import { pipe, mergeWith, zipWith, groupBy, filter, prop, has, values, flatten, identity } from 'ramda';

const pickTabId = (fav, tab) => ({
  ...fav,
  tabId: tab.tabId || null,
});

const injectTabIdToFavorites = pipe(
  mergeWith(zipWith(pickTabId)),
  values,
  flatten,
  filter(has('favoriteId'))
);

const groupByUrl = groupBy(prop('url'));

const doFavoriteMigration = async (query, DataTypes) => {
  await query.addColumn('favorite', 'tabId', DataTypes.STRING);

  const [favorites] = await query.sequelize.query(
    'SELECT "favoriteId", "applicationId", "url" FROM "favorite"',
    { raw: true },
  );

  const [tabs] = await query.sequelize.query(
    'SELECT "tabId", "applicationId", "url" FROM "tab" WHERE "isApplicationHome"=\'0\'',
    { raw: true },
  );

  const favoritesWithTabId = injectTabIdToFavorites(groupByUrl(favorites), groupByUrl(tabs));
  const queries = [];

  for (const fav of favoritesWithTabId) {
    queries.push(query.sequelize.query(`
        UPDATE "favorite"
        SET "tabId" = '${fav.tabId}'
        WHERE "favoriteId"='${fav.favoriteId}'
      `, { raw: true }));
  }

  await Promise.all(queries);
};

const createTabsSubdockOrderTable = async (query, DataTypes) => {
  await query.createTable('tabsSubdockOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stringifiedOrder: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
};

const getFavoriteTabsIds = async (query) => {
  const [favorites] = await query.sequelize.query(
    'SELECT "favoriteId", "applicationId", "url", "tabId" FROM "favorite"',
    { raw: true },
  );
  return favorites.map(prop('tabId')).filter(identity);
};

const migrateTabsSubdockOrderTable = async (query) => {
  const [tabs] = await query.sequelize.query(`
      SELECT "tabId", "applicationId" FROM "tab"
      WHERE "isApplicationHome"='0'
    `, { raw: true });

  const tabsByApp = groupBy(prop('applicationId'), tabs);
  const favoriteTabsIds = await getFavoriteTabsIds(query);

  const queries = [];

  for (const appId of Object.keys(tabsByApp)) {
    const tabIds = tabsByApp[appId]
      .map(prop('tabId'))
      .filter(tabId => !favoriteTabsIds.includes(tabId));

    if (tabIds.length > 0) {
      const stringifiedOrder = JSON.stringify(tabIds);
      queries.push(query.sequelize.query(`
          INSERT INTO "tabsSubdockOrder" (applicationId, stringifiedOrder, createdAt, updatedAt)
          VALUES ('${appId}', '${stringifiedOrder}', '${new Date()}', '${new Date()}')
        `, { raw: true }));
    }
  }

  await Promise.all(queries);
};

const createFavoritesSubdockOrderTable = async (query, DataTypes) => {
  await query.createTable('favoritesSubdockOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stringifiedOrder: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
};

const migrateFavoritesSubdockOrderTable = async (query) => {
  const [favorites] = await query.sequelize.query(`
      SELECT "favoriteId", "applicationId" FROM "favorite"
    `, { raw: true });

  const favoritesByApp = groupBy(prop('applicationId'), favorites);

  const queries = [];

  for (const appId of Object.keys(favoritesByApp)) {
    const favoriteIds = favoritesByApp[appId].map(prop('favoriteId'));

    if (favoriteIds.length > 0) {
      const stringifiedOrder = JSON.stringify(favoriteIds);
      queries.push(query.sequelize.query(`
          INSERT INTO "favoritesSubdockOrder" (applicationId, stringifiedOrder, createdAt, updatedAt)
          VALUES ('${appId}', '${stringifiedOrder}', '${new Date()}', '${new Date()}')
        `, { raw: true }));
    }
  }

  await Promise.all(queries);
};


export default {
  async up(query, DataTypes) {
    await doFavoriteMigration(query, DataTypes);

    await createTabsSubdockOrderTable(query, DataTypes);
    await migrateTabsSubdockOrderTable(query, DataTypes);

    await createFavoritesSubdockOrderTable(query, DataTypes);
    await migrateFavoritesSubdockOrderTable(query, DataTypes);
  },

  async down(query, DataTypes) {
    await query.removeColumn('favorite', 'tabId');
    await query.dropTable('tabsSubdockOrder');
    await query.dropTable('favoritesSubdockOrder');
  }
};
