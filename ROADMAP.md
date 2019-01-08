# Roadmap

- extract most utils to @reworkjs/utils package

## Parallel Builds

- start: Auto-relaunch dead processes
- Add the possibility to close windows of completed processes in split view

## Dev Life Quality

- In dev mode, getting .isRunning on a saga should throw if it doesn't have "trackStatus" enabled.
- @@main-component should be optional
- If no route matches, and no 404 is available, return a default 404 which prints the error message! (only in dev mode!)
- Generator Scripts:
  - !! Add Route
- Don't create non-existing folders when building the app, simply ignore them. Create these folders during `rjs init`
- Generate a port from 3000 going up rather than generating a completely random port.
- Name more bundles

## Optimize

- Auto-Extract licenses from CSS files to LICENSE files
- Add support for DLL Plugin.
- React & React-Dom should be in a separate DLL.js file

## Future versions

- Update React-Router
- Server-side rendering
  - Add a "no-js" class to body and remove it once the js has loaded
- Extract redux to its own package
- Logger: Remove color codes when writing to file
- Add `rjs launch`
  - Same as start but doesn't build.
- Install `react-dev-utils`:
  - use `formatWebpackMessages` in builder output
  - use `openBrowser` in `rjs start`
  - Install `webpackHotDevClient` & `WatchMissingNodeModulesPlugin`
- ServerBuilder:
  - Should not output non-js assets (index.html, .css, /public). (file-loader: emitFile=false)
  - Needs to know the reference to those assets.
- /favicon.ico should return the ico of the app.
- Better debug messages when file not found by webpack
  ```
  ERROR in ./~/reworkjs/lib/framework/common/i18n.js
  Module not found: Error: Can't resolve '@@directories.translations' in '/Users/ephys/Documents/dev/secretsanta/client2/node_modules/reworkjs/lib/framework/common'
   @ ./~/reworkjs/lib/framework/common/i18n.js 33:25-99
   @ ./~/reworkjs/lib/framework/app/App.js
   @ ./~/reworkjs/lib/framework/client/index.js
   @ multi main
   ```
- Documentation.
  - Getting Started.
  - How srcset-loader is used.
- Unit Tests.

## Potential future versions

- https://github.com/jhamlet/svg-react-loader for svg with query ?inline
https://github.com/jantimon/favicons-webpack-plugin
- https://github.com/webpack-contrib/json5-loader
- https://www.npmjs.com/package/postcss-image-set-polyfill
- Autofix JS files ? https://github.com/okonet/lint-staged#automatically-fix-code-style-with---fix-and-add-to-commit
- Autofix css files ? https://github.com/okonet/lint-staged#automatically-fix-scss-style-with-stylefmt-and-add-to-commit
- LoaderOptionsPlugin({ minimize: true })
- Replace current React-HMR system with https://github.com/gaearon/react-hot-loader
- FaviconsWebpackPlugin
