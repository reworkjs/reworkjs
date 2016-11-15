import express from 'express';
import ngrok from 'ngrok';
import chalk from 'chalk';
import ip from 'ip';
import getPort from 'get-port';
import argv from '../../shared/argv';
import { isDev } from '../../shared/EnvUtil';
import logger from '../../shared/logger';
import frameworkConfig from '../../shared/framework-config';
import webpackConfig from '../../shared/webpack/webpack.client';
import serveReactMiddleware from './middlewares/serve-react-middleare';

export default (async function() {
  const app = express();

  // public resources directory
  app.use(express.static(frameworkConfig.directories.resources));

  if (!argv.port) {
    argv.port = await getPort();
    logger.info(`Using available port ${chalk.magenta(argv.port)}, use ${chalk.blue('--port <number>')} to set the port to use.`);
  }

  serveReactMiddleware(app, {
    ...argv,
    outputPath: frameworkConfig.directories.build,
    publicPath: webpackConfig.output.publicPath,
  });

  const port = argv.port || process.env.PORT || 3000;

  await promisify(app.listen).call(app, port);

  const enableNgrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel;

  let tunnelUrl = null;
  if (enableNgrok) {
    tunnelUrl = await promisify(ngrok.connect).call(ngrok, port);
  }

  printAppStarted(port, tunnelUrl);
}());

function promisify(func) {
  return function callbackToPromise(...args) {
    return new Promise((resolve, reject) => {
      args.push((err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });

      func.apply(this, args); // eslint-disable-line
    });
  };
}

const divider = chalk.gray('\n\t-----------------------------------');

function printAppStarted(port, tunnelUrl) {
  logger.info(`Server started ${chalk.green('✓')}`);

  // If the tunnel started, log that and the URL it's available at
  if (tunnelUrl) {
    logger.info(`Tunnel initialised ${chalk.green('✓')}`);
  }

  console.info(`
\t${chalk.bold('Access URLs:')}${divider}
\tLocalhost: ${chalk.magenta(`http://localhost:${port}`)}
\t      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`) + (tunnelUrl ? `\n\t    Proxy: ${chalk.magenta(tunnelUrl)}` : '')}${divider}
\t${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
}
