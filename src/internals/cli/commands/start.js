import fs from 'fs';
import mkdirp from 'mkdirp';
import webpack from 'webpack';
import getPort from 'get-port';
import chalk from 'chalk';
import { getDefault } from '../../../shared/util/ModuleUtil';
import frameworkConfig from '../../config/framework-config';
import { requireRoot } from '../../util/RequireUtil';
import { info, error, warn } from '../stdio';

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

const DEBUG_LOCATION = `${frameworkConfig.directories.build}/webpack-debug.log`;
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

  const compiler = webpack(webpackConfig);
  compiler.watch({
    aggregateTimeout: 300,
  }, (err, stats) => {
    if (err) {
      error('Fatal error when building server');
      error(err);
      throw err;
    }

    const jsonStats = stats.toJson();
    if (jsonStats.warnings.length > 0) {
      warn(`${jsonStats.warnings.length} warnings occurred when building your app.`);
    }

    if (jsonStats.errors.length > 0) {
      error(`${jsonStats.errors.length} errors occurred when building your app.`);
    } else {
      info('Build completed');
    }

    if (jsonStats.errors.length > 0 || jsonStats.warnings.length > 0) {
      mkdirp.sync(frameworkConfig.directories.build);
      fs.writeFileSync(DEBUG_LOCATION, stats.toString());
      warn(`Debug log outputed at ${chalk.green(DEBUG_LOCATION)}`);

      if (jsonStats.errors.length + jsonStats.warnings.length < 10) {
        if (jsonStats.errors.length > 0) {
          error('Errors: ');
          for (const errorStat of jsonStats.errors) {
            error(`${errorStat}\n`);
          }
        }

        if (jsonStats.warnings.length > 0) {
          warn('Warnings: ');
          for (const warningStat of jsonStats.warnings) {
            warn(`${warningStat}\n`);
          }
        }
      }
    }
  });
}

export const usage = `Accepted options: --port
Possible modes: dev, prod, tunnel`;
