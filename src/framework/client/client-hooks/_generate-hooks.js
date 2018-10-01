// This file is run by webpack, and the code it generates is the one that will actually be used
// See: val-loader

/* eslint-disable import/no-commonjs */

// need to import from /lib (the version in which webpack is running) otherwise it will use /es
const { getHooks, HOOK_SIDES } = require('../../../../lib/internals/get-plugins');

module.exports = function getClientHooks() {
  const hookFiles = getHooks(HOOK_SIDES.client);

  const requireArray = `[${hookFiles.map(hookFile => `require(${JSON.stringify(hookFile)})`).join(',')}]`;

  return { code: `export default ${requireArray};` };
};
