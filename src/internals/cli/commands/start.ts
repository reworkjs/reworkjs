import logger from '@reworkjs/core/logger';
import type Yargs from 'yargs';
import { chalkEnvVar } from '../../../shared/chalk.js';
import featureHelp from '../get-webpack-features-help.js';
import { startApp } from '../node-interface.js';

/**
 * This command registers a "start" command that launches builds and serve the app.
 *
 * With Pre-rendering:
 *  PROD:
 *    Build Server & Client
 *    Launch "Server" with pre-rendering. (Server serves assets and pre-renders).
 *  DEV:
 *    Build Server & Client.
 *    Launch HMR Server for client? -- for front-end HMR.
 *    Launch Server for pre-rendering.
 *    HMR Server (back-end HMR).
 *
 * Without Pre-rendering:
 *  PROD:
 *    rjs build client
 *    Serve assets & index.html
 *  DEV:
 *    Build Client
 *    Delegate to webpack-dev-middleware
 */
export default function registerCommand(cli: Yargs.Argv) {

  cli
    .command('start', 'Launches the application', yargs => {
      yargs
        .option('ssr', {
          type: 'boolean',
          default: false,
          describe: 'Enable server-side rendering',
        })
        .option('split', {
          type: 'boolean',
          default: false,
          describe: 'Enable terminal split-view',
        })
        .option('port', {
          type: 'number',
          default: 3000,
          describe: 'The port the server will listen to',
        })
        .option(featureHelp)
        .parserConfiguration({ 'populate--': true });
    }, async argv => {
      argv['--'] = argv['--'] || [];

      const env = process.env.NODE_ENV ?? 'production';

      logger.info(`Launching app in ${chalkEnvVar(env)} mode...`);
      if (!process.env.NODE_ENV) {
        logger.info(`Set ${chalkEnvVar('NODE_ENV')} env variable to 'development' or 'test' for alternative modes.`);
      }

      return startApp({
        ssr: argv.ssr as boolean,
        port: argv.port as number,
        split: argv.split as boolean,
        env,
      });
    });
}

