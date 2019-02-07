// @flow

import { promisify } from 'util';
import express from 'express';
import chalk from 'chalk';
import getPort from 'get-port';
import argv from '../../internals/rjs-argv';
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

  const app = express();
  setupHttpServer(app);

  await promisify(app.listen).call(app, port);

  if (hideHttp) {
    logger.info('Server-side rendering ready.');
  } else {
    printServerStarted(port);
  }
}());
