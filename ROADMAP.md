# Roadmap

## Parallel Builds

- Fix `rjs start --env prod --no-prerendering`
- Fix `rjs start --env prod --prerendering`
- start: Auto-relaunch the server if HMR failed.
- start: Auto-relaunch dead processes

## Future versions

- Server-side rendering:
  - allow ReactHelmet to override pre-existing meta-tags.
- Intl:
  - Allow the use of .json files for translation files.
  - Load and activate the IntlPolyfill for the active locale
- Add support for DLL Plugin.
- Name bundles
- Create a default example project on github.
- Generate a port from 3000 going up rather than generating a completely random port.
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
- Documentation
  - How srcset-loader is used
- Unit Tests

## Potential future versions

- eslint plugin that detects @provider and warns if anything in the annotated class isn't static
- Install current React-HMR system with https://github.com/gaearon/react-hot-loader ?
- Review css-loader's CSSNano options
- Review image-webpack-loader options
- Optimise Bundle-loader (if even possible)
- Migrate to yarn
- add "transform-export-default-name"
- add "babel-plugin-annotate-console-log" (dev-only)
- add webpack WatchMissingNodeModulesPlugin
- @provider
  - Getting non-defined state outside of reducers should throw
  - Setting non-defined state outside of reducers should throw
