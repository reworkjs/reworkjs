import chalk from 'chalk';
import frameworkConfig from '../../../shared/framework-config';
import { getDefault } from '../../../shared/util/ModuleUtil';
import compileWebpack, { StatDetails, EntryPoint } from '../compile-webpack';
import { runCommandSync } from '../run-command';
import { info } from '../stdio';

export default async function start([mode = 'production'], otherArgs) {
  if (mode === 'dev') {
    process.env.NODE_ENV = 'development';
  } else if (mode === 'prod') {
    process.env.NODE_ENV = 'production';
  } else {
    process.env.NODE_ENV = mode;
  }

  info(`Launching app in ${process.env.NODE_ENV} mode...`);
  if (otherArgs.prerendering === false) {
    await runServerWithoutPrerendering();
  } else {
    await runServerWithPrerendering();
  }
}

function runServerWithoutPrerendering() {
  return require('../../../framework/server/init'); // eslint-disable-line
}

function runServerWithPrerendering() {
  info('Building your server-side app, this might take a minute.');
  info(`You can disable server-side rendering using ${chalk.blue('--no-prerendering')}.`);
  const webpackConfig = getDefault(require('../../../shared/webpack/webpack.server.js')); // eslint-disable-line

  compileWebpack(webpackConfig, true, (stats: StatDetails) => {
    const entryPoints: EntryPoint = stats.entrypoints.main.assets.filter(fileName => fileName.endsWith('.js'));

    if (entryPoints.length !== 1) {
      throw new Error('Webpack built but the output does not have exactly one entry point. This is a bug.');
    }

    info('Starting server...');

    const entryPoint = entryPoints[0];
    // TODO replace webpack-server with variable.
    runCommandSync(`node ${frameworkConfig.directories.build}/webpack-server/${entryPoint}`);
  });
}

export const usage = `framework start <mode> <options...>

Possible modes: dev, prod
Accepted options: --port <number>, --no-prerendering, --tunnel`;
