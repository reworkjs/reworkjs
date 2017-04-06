import express from 'express';
import ngrok from 'ngrok';
import chalk from 'chalk';
import getPort from 'get-port';
import argv from '../../shared/argv';
import logger from '../../shared/logger';
import setupHttpServer from './setup-http-server';
import printServerStarted from './print-server-started';

chalk.enabled = true;

/**
 * This server does two things:
 * 1. Serve requested static files from the client build if they exist.
 * 2. Otherwise, pre-render the app and send the output.
 */
export default (async function initServer() {
  const hideHttp = Boolean(argv['hide-http']);

  if (!argv.port && !hideHttp) {
    logger.info(`Use ${chalk.blue('--port <number>')} to set the port to use.`);
  }

  const port = argv.port || process.env.PORT || await getPort();
  if (!hideHttp) {
    logger.info(`Server starting on port ${chalk.magenta(port)}.`);
  }

  const app = express();
  setupHttpServer(app);

  await promisify(app.listen).call(app, port);

  const enableNgrok = (process.env.NODE_ENV === 'development' && process.env.ENABLE_TUNNEL) || argv.tunnel;

  let tunnelUrl = null;
  if (enableNgrok) {
    tunnelUrl = await promisify(ngrok.connect).call(ngrok, port);
  }

  if (hideHttp) {
    logger.info('Server-side rendering ready.');
  } else {
    printServerStarted(port, tunnelUrl);
  }
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
