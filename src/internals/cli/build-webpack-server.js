import chalk from 'chalk';
import '../../shared/regenerator';
import logger from '../../shared/logger';
import serverWebpackConfig from '../../shared/webpack/webpack.server';
import compileWebpack, { StatDetails, EntryPoint } from '../../shared/compile-webpack';
import frameworkConfig from '../../shared/framework-config';

chalk.enabled = true;
logger.info('Building your server-side app, this might take a minute.');
logger.info(`You can disable server-side rendering using ${chalk.blue('--no-prerendering')}.`);

compileWebpack(serverWebpackConfig, true, (stats: StatDetails) => {
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

  const entryPoint = entryPoints[0];
  const serverFile = `${frameworkConfig.directories.build}/webpack-server/${entryPoint}`;

  logger.debug(`Entry point: ${chalk.blue(serverFile)}`);

  // tell manager CLI to launch server
  if (process.send) {
    process.send({
      cmd: 'launch',
      exe: serverFile,
    });
  }
});
