'use strict';

// need to import from /lib (the version in which webpack is running) otherwise it will use /es

const path = require('path');
const config = require('../../../../lib/shared/framework-config');
const { asyncGlob } = require('../../../../lib/internals/util/util');

module.exports = function getRouteDeclarations() {

  const routeGlob = config.default.routes;

  // files are found relative to config file
  const configDir = path.dirname(config.default.filePath);
  return asyncGlob(routeGlob, { cwd: configDir }).then(routeFiles => {

    routeFiles = routeFiles.map(file => path.resolve(configDir, file));

    const requireArray = `[${routeFiles.map(fileName => `require(${JSON.stringify(fileName)})`).join(',')}]`;
    let code = `const o = ${requireArray}; export default o;`; // add the list of file paths in dev for easier debugging.

    // add the list of file paths in dev for easier debugging.
    if (process.env.NODE_ENV !== 'production') {
      const fileNames = `[${routeFiles.map(fileName => JSON.stringify(fileName)).join(',')}]`;

      code += `o.__debugFileNames = ${fileNames}`;
    }

    return { code };
  });
};
