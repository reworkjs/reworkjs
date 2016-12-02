- Prod mode
- Default project
- make babelrc optional
- install sanitize.css
- don't default to dummy dir, create the dirs instead.
- name bundles

possible babel plugins:
- "transform-export-default-name"
- "babel-plugin-annotate-console-log" (dev-only)

Disable console.* warnings in webpack-eslint (make them warnings)

Better debug messages when file not found by webpack

Manifest support ?
url/favicon.ico support ?

Disallow the direct use of process.env in webpack builds
http://eslint.org/docs/rules/no-process-env

ERROR in ./~/reworkjs/lib/framework/common/i18n.js
Module not found: Error: Can't resolve '@@directories.translations' in '/Users/ephys/Documents/dev/secretsanta/client2/node_modules/reworkjs/lib/framework/common'
 @ ./~/reworkjs/lib/framework/common/i18n.js 33:25-99
 @ ./~/reworkjs/lib/framework/app/App.js
 @ ./~/reworkjs/lib/framework/client/index.js
 @ multi main

Replace `selectWebpackModulePlugin` with `resolve.mainField`
