import path from 'path';
import chalk from 'chalk';
import logger from '../../shared/logger';
import config from './webpack.server';
import compileWebpack, { StatDetails, EntryPoint } from './compile-webpack';

chalk.enabled = true;
logger.info('Building your server-side app, this might take a minute.');

const WATCH = process.env.WATCH === 'true';

compileWebpack(config, WATCH, (stats: StatDetails) => {
  const entryPoints: EntryPoint = stats.entrypoints.main.assets.filter(fileName => {
    if (!fileName.endsWith('.js')) {
      return false;
    }

    // ignore hot updates for now
    return !fileName.endsWith('.hot-update.js');
  });

  if (entryPoints.length !== 1) {
    logger.debug('entry points:');
    logger.debug(entryPoints);
    throw new Error('Webpack built but the output does not have exactly one entry point. This is a bug.');
  }

  const entryPoint = path.join(config.output.path, entryPoints[0]);

  // don't need to know about the entry point if it is handled by another process automatically.
  const method = process.send ? 'debug' : 'info';

  logger[method](`Server entry point: ${chalk.blue(entryPoint)}`);

  // tell manager CLI to launch server
  if (process.send) {
    process.send({
      cmd: 'built',
      exe: entryPoint,
    });
  }
});
