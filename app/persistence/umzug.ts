import log from 'electron-log';
import * as path from 'path';
import { SequelizeStorage, Umzug } from 'umzug';
import db from '../database/database';
import { DataTypes } from 'sequelize';

const umzug = new Umzug({
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),

  migrations: {
    glob: path.resolve(__dirname, 'umzug-runs', '*.js'),
    resolve(params) {
      let f = require(`./umzug-runs/${path.basename(params.name)}`);
      f = f.default ? f.default : f;
      return {
        ...params,
        up({ context }) {
          return f.up(context, DataTypes);
        },
        down({ context }) {
          return f.down(context, DataTypes);
        }
      };
    }
  },
  logger: process.env.NODE_ENV === 'test' ? undefined : log
});

export default umzug;
