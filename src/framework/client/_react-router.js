// @flow

// this module is ran on node before webpack bundles it.

/* eslint-disable import/no-commonjs */

// need to import from /lib (the version in which webpack is running) otherwise it will use /es
const config = require('../../../lib/shared/framework-config');

module.exports = function getRouteDeclarations() {

  const isHash = config.default.routingType === 'hash';

  return {
    code: `export const isHash = ${isHash}`,
  };
};
