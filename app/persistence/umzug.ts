import log from 'electron-log';
import * as path from 'path';
import * as Umzug from 'umzug';
import db from '../database/database';

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: db,
  },

  // see: https://github.com/sequelize/umzug/issues/17
  migrations: {
    params: [
      db.getQueryInterface(), // queryInterface
      db.constructor, // DataTypes
      () => {
        throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
      },
    ],
    path: path.resolve(__dirname, 'umzug-runs'),
    pattern: /\.[jt]s$/,
    customResolver(migrationFile: string) {
      return require(`./umzug-runs/${path.basename(migrationFile)}`);
    },
  },
  logging: process.env.NODE_ENV === 'test' ? false : log.info,
});

export default umzug;
