import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import defaults from 'lodash/defaultsDeep';
import packageMetadata from '../../util/package-metadata';
import config from '../config';

const dllConfig = defaults(packageMetadata.dllPlugin, config.dllPlugin.defaults);
const outputPath = path.join(process.cwd(), dllConfig.path);
const dllManifestPath = path.join(outputPath, 'package.json');

const exists = fs.existsSync;
const writeFile = fs.writeFileSync;

// No need to build the DLL in production
if (process.env.NODE_ENV === 'production') {
  process.exit(0);
}

shell.mkdir('-p', outputPath);

shell.echo('Building the Webpack DLL...');

if (!exists(dllManifestPath)) {
  writeFile(
    dllManifestPath,
    JSON.stringify(defaults({
      name: 'project-dlls',
      private: true,
      author: packageMetadata.author,
      repository: packageMetadata.repository,
      version: packageMetadata.version,
    }), null, 2),

    'utf8'
  );
}

// the BUILDING_DLL env var is set to avoid confusing the development environment
shell.exec(
  'cross-env BUILDING_DLL=true ' +
  'webpack --display-chunks --color --config ' +
  'internals/webpack/webpack.dll.babel.js'
);

shell.echo(`\nDLLs stored in ${outputPath}`);
