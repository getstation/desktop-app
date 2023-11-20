import * as Immutable from 'immutable';
import umzug from './umzug';
import db from '../database/database';

export const checkSqliteBackend = async () => {
  const executedPromise = umzug.executed().then(ms => ms.map(m => m.name));
  const allPromise = umzug
    .migrations(db.getQueryInterface())
    .then(ms => ms.map(m => m.name));
  return Promise.all([executedPromise, allPromise]).then(([executed, all]) => {
    const executedSet = Immutable.Set(executed);
    const allSet = Immutable.Set<string>(all);
    const unknownSet = executedSet.subtract(allSet);
    if (unknownSet.size > 0) {
      // This means that the state we are trying to read is more up to date (or incompatible)
      // than the version of Station. This is an error !
      throw new Error(`
The saved Station state is not compatible with the current Station version.
UnknownSets: ${unknownSet.join(', ')}
        `);
    }
    return executed;
  });
};

export const migrateUmzug = async () => await umzug.up();
