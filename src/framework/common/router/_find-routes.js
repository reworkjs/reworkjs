// @flow

'use strict';

/* eslint-disable import/no-commonjs */

// need to import from /lib (the version in which webpack is running) otherwise it will use /es
const config = require('../../../../lib/shared/framework-config');
const { asyncGlob } = require('../../../../lib/internals/util/util');

module.exports = async function getRouteDeclarations() {

  // config.routes
  const routeGlob = config.default.routes;
  const routeFiles = await asyncGlob(routeGlob);

  const requireArray = `[${routeFiles.map(fileName => `require(${JSON.stringify(fileName)})`).join(',')}]`;
  let code = `const o = ${requireArray}; export default o;`;

  // add the list of file paths in dev for easier debugging.
  if (process.env.NODE_ENV !== 'production') {
    const fileNames = `[${routeFiles.map(fileName => JSON.stringify(fileName)).join(',')}]`;

    code += `o.__debugFileNames = ${fileNames}`;
  }

  return { code };
};
