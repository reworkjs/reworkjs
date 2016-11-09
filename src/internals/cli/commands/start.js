import getPort from 'get-port';
import frameworkConfig from '../../../shared/framework-config';
import { getDefault } from '../../../shared/util/ModuleUtil';
import { requireRoot } from '../../util/RequireUtil';
import compileWebpack, { StatDetails, EntryPoint } from '../compile-webpack';
import { runCommandSync } from '../run-command';
import { info, error } from '../stdio';

export default function start([mode], otherArgs) {
  if (mode === 'dev' || mode === 'development') {
    return startDev(otherArgs);
  }

  error(`Unknown mode ${mode}`);
  process.exit(1);

  // TODO
  // prod || production
  // tunnel
}

// TODO rewrite
async function startDev(otherArgs) {
  info('Launching app in development mode...');

  process.env.NODE_ENV = 'development';

  const args = process.argv.splice(4);
  if (!otherArgs.port) {
    args.push('--port', await getPort());
  }

  info('Building your server-side app, this might take a minute.');
  const webpackConfig = getDefault(requireRoot('lib/internals/webpack/webpack.server.js'));

  compileWebpack(webpackConfig, true, (stats: StatDetails) => {
    const entryPoints: EntryPoint = stats.entrypoints.main;

    if (entryPoints.assets.length !== 1) {
      throw new Error('Webpack built but the output does not have exactly one entry point. This is a bug.');
    }

    info('Starting server...');

    const entryPoint = entryPoints.assets[0];
    // TODO replace webpack-server with variable.
    runCommandSync(`node ${frameworkConfig.directories.build}/webpack-server/${entryPoint}`);
  });
}

export const usage = `Accepted options: --port
Possible modes: dev, prod, tunnel`;
