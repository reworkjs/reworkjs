// this module is ran on node before webpack bundles it.
import path from 'path';
import config from '@reworkjs/core/_internal_/framework-config';
import { asyncGlob } from '../../../internals/util/util.js';

export default function getRouteDeclarations() {

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
}
