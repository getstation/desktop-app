import * as BluebirdPromise from 'bluebird';
import { spawn } from 'child_process';
import log from 'electron-log';
import umzug from '../persistence/umzug';
import db from './database';
import { getDatabasePath } from './database.prod';

const describe = () => db.getQueryInterface()
  .showAllTables()
  .then(tableNames => BluebirdPromise.each(tableNames, tableName =>
    db.getQueryInterface()
      .describeTable(tableName)
      .then(attributes => {
        log.log('\nTABLE:', tableName);
        log.log(attributes);
        return;
      })
    )
  );

export const exec = (args: string[]) => {
  if (args.length === 0) return Promise.reject(new Error('No command passed'));
  const command = args[0];

  if (command === 'migrations') {
    return require('umzug-cli')((umzug as any).options).cli(args.splice(1)); // eslint-disable-line global-require
  }

  switch (command) {
    case 'describe':
      return describe();
    case 'sqlitebrowser': {
      const child = spawn('open', [
        '-a', '/Applications/DB Browser for SQLite.app', getDatabasePath(),
      ], {
        detached: true, stdio: 'ignore',
      });
      child.unref();
      return Promise.resolve();
    }
    default:
      return Promise.reject((new Error(`Command ${command} unknown`)));
  }
};
