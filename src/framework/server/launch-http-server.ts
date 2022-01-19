import { promisify } from 'util';
import logger from '@reworkjs/core/logger';
import express from 'express';
import getPort from 'get-port';
import argv from '../../internals/rjs-argv.js';
import { chalkArgvParam } from '../../shared/chalk.js';
import printServerStarted from './print-server-started.js';
import setupHttpServer from './setup-http-server/index.js';

/**
 * This server does two things:
 * 1. Serve requested static files from the client build if they exist.
 * 2. Otherwise, pre-render the app and send the output.
 */
const hideHttp = Boolean(argv['hide-http']);

if (!argv.port && !hideHttp) {
  logger.info(`Use ${chalkArgvParam('--port <number>')} to set the port to use.`);
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

if (process.send) {
  process.send({ cmd: 'accepting-connections' });
}
