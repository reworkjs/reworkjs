/**
 * @module framework-config
 *
 * Version for built server bundles.
 *
 * DO NOT use in client bundle.
 * DO NOT use in internal tools (cli, builders).
 */

import { resolve } from 'path';

// @ts-expect-error
const config = $$RJS_VARS$$.FRAMEWORK_CONFIG;

// Once built this will look like:
// const config = {"directories":{"logs":"..","build":".."}};
// The variable is injected using Webpack's DefinePlugin (see WebpackBase).

for (const dirName of Object.keys(config.directories)) {
  // File paths have been transformed into relative paths before being injected so the app directory is not hardcoded.
  // Here we convert them back into absolute path using the correct app directory
  // for compatibility with the rest of the app.
  // More info in WebpackBase where we inject the variables.
  config.directories[dirName] = resolve(__dirname, config.directories[dirName]);
}

export default config;
