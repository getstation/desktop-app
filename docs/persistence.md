## How to add state persistence
Currently the only backend we have is defined in _app/persistence/local.backend.ts_

### Example with `App`

```typescript
export class AppProxy extends SingletonProxyMixin({
  // App is the Sequelize model
  model: App,
  // Maps 'app' state to an object that can be fed to sequelize for insert or update
  mapStateToObject: async state => ({
    version: state.get('version'),
    autoLaunchEnabled: state.get('autoLaunchEnabled'),
    downloadFolder: state.get('downloadFolder'),
  }),
  // Maps sequelize object to 'app' redux state
  // As our state is fully Immutable, we must be sure that this always return Immutable objects
  mapObjectToState: async obj => Immutable.Map({
    version: obj.version,
    autoLaunchEnabled: obj.autoLaunchEnabled,
    downloadFolder: obj.downloadFolder,
  }),
}) {
}
```

- Simple maps should extend `SingletonProxyMixin`
- Complex maps should extend `KeyedProxyMixin`
- Set and List should extend `ListProxyMixin`

Then, at the end of the file, add your mapping like this:
```javascript
export default {
  app: new SingletonStateProxy(AppProxy),
  ...
}
```

### Unit tests
See _test/persistence/test-app.ts_ for simple example, and _test/persistence/applications-app.ts_
for more complex ones.

### Edit or create Model
See _app/database/model.ts_

### Migration script
Add your migration script in _app/persistence/umzug-runs/_ folder.
Your migration script should be the latest executed script (alphabetically sorted).

### Define new types
If we need to add a new mapping type (i.e. for `Immutable.Record`), here is what must be done:
- Add a new type of proxy in _app/persistence/backend.ts_.
The new class MUST implement the following methods
  - `clear()`
  - `toState()`
  - `async get()`
  - `async set(state)`
- Add a new type of proxy in _app/persistence/local.backend.ts_.
For simplicity, is can extend `SingletonProxy`.
The new class MUST implement the following methods
  - `static async mapStateToObject()`
  - `static mapObjectToState()`
  - `static async create()`
  - `get()`
  - `async update(state)`
  - `toJSON()`
  - `isEmpty()`
  - `toState()`
