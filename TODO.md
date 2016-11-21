- add to dependencies:
-- html-webpack-plugin
-- offline-plugin
-- extract-text-webpack-plugin
-- cheerio
-- ngrok
-- babel-loader
-- json-loader

- add to peer dep:
-- eslint

- remove from peer dep:
-- webpack
-- webpack loaders

Better debug messages when file not found by webpack

ERROR in ./~/reworkjs/lib/framework/common/i18n.js
Module not found: Error: Can't resolve '@@directories.translations' in '/Users/ephys/Documents/dev/secretsanta/client2/node_modules/reworkjs/lib/framework/common'
 @ ./~/reworkjs/lib/framework/common/i18n.js 33:25-99
 @ ./~/reworkjs/lib/framework/app/App.js
 @ ./~/reworkjs/lib/framework/client/index.js
 @ multi main
