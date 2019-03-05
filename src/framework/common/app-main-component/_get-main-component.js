// @flow

// this module is ran on node before webpack bundles it.

/* eslint-disable import/no-commonjs */

const path = require('path');

// need to import from /lib (the version in which webpack is running) otherwise it will use /es
const config = require('../../../../lib/shared/framework-config');

const DEFAULT_ENTRY = `
import { Fragment } from 'react';
export default Fragment;
`;

module.exports = function getRouteDeclarations() {

  const entryConfig = config.default['entry-react'];
  if (!entryConfig) {
    return { code: DEFAULT_ENTRY };
  }

  const filePath = path.resolve(entryConfig);

  return {
    code: `
      export { default } from ${JSON.stringify(filePath)};
    `,
  };
};
