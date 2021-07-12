import * as cls from 'continuation-local-storage';
import { app, remote } from 'electron';
import log from 'electron-log';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as Sequelize from 'sequelize';
import operatorsAliases from './operatorsAliases';

const isRenderer = process.type === 'renderer';

export const getDatabaseDir = () => {
  const userDataPath = (isRenderer ? (remote.app) : app).getPath('userData');
  const p = path.join(userDataPath, 'db');
  mkdirp.sync(p);
  return p;
};

export const getDatabasePath = () => {
  if (process.env.STATION_DB_PATH) return process.env.STATION_DB_PATH;
  return path.join(getDatabaseDir(), 'station.db');
};

export const createEngine = () => {
  const ns = cls.createNamespace('station');
  Sequelize.useCLS(ns);

  const dbPath = getDatabasePath();
  // http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
  const e = new Sequelize({
    database: 'station',
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 3600,
    },
    operatorsAliases,
    transactionType: Sequelize.Transaction.TYPES.IMMEDIATE,
    logging: () => {},
    storage: dbPath,
  });
  log.debug(`Using database at ${dbPath}`);

  e.query('PRAGMA journal_mode = WAL;');
  e.query('PRAGMA auto_vacuum = 1;');

  // Do not plug services when we are using CLI
  if (!process.env.BX_CLI) {
    const { handleError } = require('../services/api/helpers');
    const { observer } = require('../services/lib/helpers');
    require('../services/servicesManager').default.electronApp.addObserver(observer({
      onBeforeQuit() {
        e.query('PRAGMA optimize;');
        e.query('VACUUM;');
      },
    }, 'db-quit')).catch(handleError());
  }

  return e;
};

const engine = createEngine();

export default engine;
