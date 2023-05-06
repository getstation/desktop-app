import log from 'electron-log';
import * as path from 'path';
import { SequelizeStorage, Umzug } from 'umzug';
import db from '../database/database';
import { DataTypes } from 'sequelize';

const umzug = new Umzug({
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),

  migrations: {
    glob: process.platform === 'win32'
            ? path.resolve(__dirname, 'umzug-runs', '*.js').replaceAll('\\', '/')
            : path.resolve(__dirname, 'umzug-runs', '*.js'),
    resolve({ name }) {
      let f = require(`./umzug-runs/${path.basename(name)}`);
      f = f.default ? f.default : f;
      return {
        name,
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
