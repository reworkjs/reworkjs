// this module is ran on node before webpack bundles it.

const path = require('path');
const babel = require('@babel/core');
const fs = require('fs/promises');

//  see "HACK: (.codegen.cjs)" in webpack config
module.exports = async function getRouteDeclarations() {
  try {

    const [UtilModule, ResolveUtilModule, ConfigModule] = await Promise.all([
      import('../../../internals/util/util.js'),
      import('../../../internals/util/resolve-util.js'),
      import('@reworkjs/core/_internal_/framework-config'),
    ]);

    const config = ConfigModule.default;
    const { asyncGlob } = UtilModule;
    const { resolveProject, resolveRoot } = ResolveUtilModule;

    // files are found relative to config file
    const configDir = path.dirname(config.filePath);

    const viewPaths = (await asyncGlob(config.pages, { cwd: configDir }))
      .map(viewPath => path.resolve(configDir, viewPath));

    const viewsFiles = await Promise.all(viewPaths.map(async viewPath => {
      return fs.readFile(viewPath, 'utf-8');
    }));

    // doing babel.parseAsync sequentially does not work.
    // it rejects because it tries to load the same preset twice at the same time
    // unsure how to fix.
    const viewsAst = [];
    for (let i = 0; i < viewsFiles.length; i++) {
      const viewFile = viewsFiles[i];
      viewsAst.push(await babel.parseAsync(viewFile, {
        ast: true,
        filename: viewPaths[i],
        root: resolveProject(''),
      }));
    }

    const routeDefs = [];
    for (let i = 0; i < viewsAst.length; i++) {
      const ast = viewsAst[i];
      const viewPath = viewPaths[i];

      if (!ast.comments) {
        continue;
      }

      const def = {
        viewComponent: viewPath,
      };

      for (const commentAst of ast.comments) {
        const commentLines = commentAst.value.split('\n')
          .map(line => line.trim())
          .filter(line => line != '');

        for (const line of commentLines) {
          if (!line.startsWith('@route.')) {
            break;
          }

          if (line.startsWith('@route.path')) {
            def.path = line.substring('@route.path'.length).trim();
            continue;
          }

          if (line.startsWith('@route.priority')) {
            const rawValue = line.substring('@route.priority'.length).trim();
            const value = Number(rawValue);

            if (!Number.isSafeInteger(value)) {
              console.error(`@route.priority in ${viewPath} expected a safe integer but received ${JSON.stringify(rawValue)}.`);
            } else {
              def.priority = value;
            }
          }
        }
      }

      if (def.path) {
        routeDefs.push(def);
      }
    }

    const routePaths = (await asyncGlob(config.routes, { cwd: configDir }))
      .map(routePath => path.resolve(configDir, routePath));

    const code = `
${routeDefs.length > 0 ? `import loadable from '@loadable/component';` : ''}
${routePaths.map((file, i) => `import importedRoute${i} from ${JSON.stringify(file)};\n`).join('')}

const out = [
  ${routePaths.map((_file, i) => `importedRoute${i},`)}
  ${routeDefs.map(route => {
      return `{ 
      path: ${JSON.stringify(route.path)},
      priority: ${route.priority ?? 0},
      exact: true,
      component: loadable(() => import(${JSON.stringify(route.viewComponent)})), 
    },`;
    })}
]; 

if (process.env.NODE_ENV !== 'production') {
  out.__debugFileNames = [
    ${routePaths.map(fileName => `${JSON.stringify(fileName)},`)}
    ${routeDefs.map(route => `${JSON.stringify(route.viewComponent)},`)}
  ];
}

export default out;
`;

    return { code };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
