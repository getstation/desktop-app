# electron-webpack and bx
We are using [electron-webpack](https://webpack.electron.build/) (_EW_) to compile and bundle the application.
This doc aims to point the specifics of our config compared to a simple one.

## Concepts
_EW_ have some concept kinda enforced. Here is what we do differently.

### Targets
- We do not have a `common` folder, it is only leveraged by _EW_ thanks to `@common` imports.
- Our `main` target is located in [webpack.config.main.js](../webpack.config.main.js)
- Our `renderer` target is located in [webpack.config.renderer.js](../webpack.config.renderer.js)
- We also have a `webui` target that doesn't get along with _EW_, so it is executed separately via [webpack.config.webui.js](../webpack.config.webui.js)
  > NB: a PR could easily fix that IMO (@magne4000)

#### [main](../webpack.config.main.js)
Nothing too fancy here.
Mainly, like for the renderer part, it uses [webpack.config.common.js](../webpack.config.common.js)
which patches/add different things (TS, loaders, externals, etc.)

#### [renderer](../webpack.config.renderer.js)
By default, _EW_ generates a unique `renderer` entry.
As we have multiple ones, they are added here.

The worker is a renderer entry as the others.

Migration files are also compiled here as they are executed by the worker.

The `preload.js` is also generated here, and is directly written on the disk.

#### [webui](../webpack.config.webui.js)
Extends [webpack.config.base.js](../webpack.config.base.js)
which is a common base when we are running outside _EW_ process.

It is currently outside of _EW_ process because:
  - It uses a different `target` than the renderer or the main
  - We can't return [multiple webpack configurations](https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations) in _EW_ custom `webpackConfig`
    - Actually we can but only in `mode==development` but not in `mode==production

## Good to know
- In dev mode, pages are loaded from `localhost`
  - But some files are required to be on the filesystem, like the preload and the migration scripts
  - for simplicity, webui is also written on the filesystem (no HMR)
  - HMR is active
    - On the main process, reloads the whole app
    - On the worker, reloads the whole app (to optimize this we must tweak services architecture)
    - On the other renderers, React, stylesheets, reducers, and probably a lot of other things are reloaded on the fly
- `electron-builder` config files have some `extraResources` and `files` lines to cope with the fact that we use `__dirname` here and there
  - One goal would be to minimize those lines to only the necessary ones
- All files should use `export default` instead of `module.exports` syntax (mainly for migration files)
  - This is due to the fact that `babel-runtime` adds its own exports, and we can't mix both syntax
- Always prefer `require` instead of `fs` related modules if possible
