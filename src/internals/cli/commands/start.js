import getPort from 'get-port';
import { getDefault } from '../../../shared/util/ModuleUtil';
import { requireRoot } from '../../util/RequireUtil';
import { info, error } from '../stdio';
import compileWebpack from '../compile-webpack';
import { StatDetails } from '../compile-webpack';
import { EntryPoint } from '../compile-webpack';

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

  info('Building your app, this might take a minute.');
  const webpackConfig = getDefault(requireRoot('lib/internals/webpack/webpack.server.js'));


  compileWebpack(webpackConfig, true, (stats: StatDetails) => {
    const entryPoint: EntryPoint = stats.entrypoints.main;
  });
}

export const usage = `Accepted options: --port
Possible modes: dev, prod, tunnel`;
