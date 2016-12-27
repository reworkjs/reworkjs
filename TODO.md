# TODO

## Small Tasks

- Default project
- make babelrc optional
- default postcss config
- install sanitize.css
- name bundles
- Optimise Bundle-loader ?
- In dev, build the server in memory-fs ?
- Build everything from CLI, not in the server build
- eslint plugin that detects @provider and warns if anything in the annotated class isn't static
- Migrate to YARN
- Generate a port from 3000 going up rather than generating a completely random port.

possible babel plugins:
- "transform-export-default-name"
- "babel-plugin-annotate-console-log" (dev-only)

====================================================

Better debug messages when file not found by webpack

ERROR in ./~/reworkjs/lib/framework/common/i18n.js
Module not found: Error: Can't resolve '@@directories.translations' in '/Users/ephys/Documents/dev/secretsanta/client2/node_modules/reworkjs/lib/framework/common'
 @ ./~/reworkjs/lib/framework/common/i18n.js 33:25-99
 @ ./~/reworkjs/lib/framework/app/App.js
 @ ./~/reworkjs/lib/framework/client/index.js
 @ multi main

====================================================

## Locale Detection

When the app locale manually changed on the client-side:
- Set a cookie containing the locale

On the client-side:
- Use the locale defined by the cookie if available
- Otherwise use navigator.languages
- Otherwise use the default locale

On the server-side:
- Use the locale defined by the cookie if available
- Otherwise use the Accept-Language header if available
- Otherwise use the default locale

====================================================

## Redux State Pre-rendering

- http://redux.js.org/docs/recipes/ServerRendering.html

====================================================

OfflinePlugin:
- favicon.ico

## @provider

Getting non-defined state outside of reducers should throw
Setting non-defined state outside of reducers should throw
