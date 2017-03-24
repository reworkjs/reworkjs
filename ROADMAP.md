# Roadmap

## Parallel Builds

- start: Auto-relaunch dead processes
- rjs start --env prod --prerendering 
- Add the possibility to close windows of completed processes in split view

## Future versions

- Disable image optimisation in dev mode.
- Server-side rendering
  - Make sure server-side rendering works with named chunks that contain more than one module which aren't in other chunks.
  - The current system does not export the css of asynchronously loaded components because node-style-loader is broken.
  - Add a "no-js" class to body and remove it once the js has loaded
  - Locales are only preloaded for the very first request, might need to call `import()` on them every time instead of caching as webpack already caches them.
- OfflinePlugin:
  - Cache index.html and return it for every route if the server is unreachable.
- Extract decorators to their own package and rewrite them in a more modular way using visitor pattern.
- Logger: Remove color codes when writing to file
- Add `rjs launch`
  - Same as start but doesn't build.
- Install `react-dev-utils`:
  - use `formatWebpackMessages` in builder output
  - use `openBrowser` in `rjs start`
  - Install `webpackHotDevClient` & `WatchMissingNodeModulesPlugin`
- ServerBuilder:
  - Should not output non-js assets (index.html, .css, /public).
  - Needs to know the reference to those assets.
- ClientBuilder:
  - Add `compression-webpack-plugin` and `brotli-webpack-plugin` ?
  - Alternatively, run `https://www.npmjs.com/package/node-zopfli` + `https://www.npmjs.com/package/brotli`
   - output to /gzip + /brotli
   - server sends brotli or gzip or uncompressed depending on Accept Header
   - Only use `compression` to compress pre-rendered index.html files
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

- Add support for https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache and manifest ?
- LoaderOptionsPlugin({ minimize: true })
- eslint plugin that detects @provider and warns if anything in the annotated class isn't static
- Replace current React-HMR system with https://github.com/gaearon/react-hot-loader ?
- Review css-loader's CSSNano options
- Review image-webpack-loader options
- Optimise Bundle-loader (if even possible)
- Migrate to yarn
- add "transform-export-default-name"
- add "babel-plugin-annotate-console-log" (dev-only)
- @provider
  - Getting non-defined state outside of reducers should throw
  - Setting non-defined state outside of reducers should throw