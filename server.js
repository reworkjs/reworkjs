/* eslint-disable import/no-commonjs */

const serverHooks = require('./lib/framework/server/server-hooks');

module.exports = {
  hookServer: serverHooks.hookServer,
  unhookServer: serverHooks.unhookServer,
};
