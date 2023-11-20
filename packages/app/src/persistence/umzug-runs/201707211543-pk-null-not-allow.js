/* eslint-disable no-unused-vars */
const Promise = require('bluebird');
const Sequelize = require('sequelize');

// INTEGER PK do not allow NULL by default
// see https://stackoverflow.com/questions/20289410/difference-between-int-primary-key-and-integer-primary-key-sqlite#20289487
const MIGRATIONS_TABLE_AND_INDEX_COLUMN = [
  ['tab', 'tabId', Sequelize.STRING],
  ['favorite', 'favoriteId', Sequelize.STRING],
  ['identity', 'identityId', Sequelize.STRING],
  // `application` already done in `01-applicationId-null-not-allow.js`
];

export default {
  up: (query, DataTypes) => Promise.mapSeries(MIGRATIONS_TABLE_AND_INDEX_COLUMN,
    ([tableName, columnName, type]) => {
      const identifier = {};
      identifier[columnName] = null;

      return query
        .bulkDelete(tableName, identifier)
        .then(() => query.changeColumn(tableName, columnName, {
          type,
          primaryKey: true,
          allowNull: false
        }));
    }),
  down: (query, DataTypes) => Promise.mapSeries(MIGRATIONS_TABLE_AND_INDEX_COLUMN,
    ([tableName, columnName, type]) =>
      query.changeColumn(tableName, columnName, {
        type,
        primaryKey: true,
      })
  )
};
