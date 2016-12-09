- Default project
- make babelrc optional
- install sanitize.css
- don't default to dummy dir, create the dirs instead.
- name bundles

possible babel plugins:
- "transform-export-default-name"
- "babel-plugin-annotate-console-log" (dev-only)

Better debug messages when file not found by webpack

ERROR in ./~/reworkjs/lib/framework/common/i18n.js
Module not found: Error: Can't resolve '@@directories.translations' in '/Users/ephys/Documents/dev/secretsanta/client2/node_modules/reworkjs/lib/framework/common'
 @ ./~/reworkjs/lib/framework/common/i18n.js 33:25-99
 @ ./~/reworkjs/lib/framework/app/App.js
 @ ./~/reworkjs/lib/framework/client/index.js
 @ multi main

Replace `selectWebpackModulePlugin` with `resolve.mainField`

In dev, build the server in memory-fs ?
Or separate from the prod build

eslint plugin that detects @provider and warns if anything in the annotated class isn't static

Migrate to YARN

- Optimise Bundle-loader ?