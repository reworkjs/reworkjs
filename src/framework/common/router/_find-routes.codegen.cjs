// this module is ran on node before webpack bundles it.
const path = require('path');

//  see "HACK: (.codegen.cjs)" in webpack config
module.exports = async function getRouteDeclarations() {
  const [UtilModule, ConfigModule] = await Promise.all([
    import('../../../internals/util/util.js'),
    import('@reworkjs/core/_internal_/framework-config'),
  ]);

  const config = ConfigModule.default;
  const { asyncGlob } = UtilModule;

  const routeGlob = config.routes;

  // files are found relative to config file
  const configDir = path.dirname(config.filePath);

  return asyncGlob(routeGlob, { cwd: configDir }).then(routeFiles => {
    routeFiles = routeFiles.map(file => path.resolve(configDir, file));

    return {
      code: `
${routeFiles.map((file, i) => `import importedValue${i} from ${JSON.stringify(file)};\n`).join('')}

const o = [${routeFiles.map((_file, i) => `importedValue${i}`).join(',')}]; 

if (process.env.NODE_ENV !== 'production') {
  o.__debugFileNames = [${routeFiles.map(fileName => JSON.stringify(fileName)).join(',')}];
}

export default o;
      `
    };
  });
};
