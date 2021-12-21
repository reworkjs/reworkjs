import logger from '@reworkjs/core/logger';
import type Yargs from 'yargs';
import { chalk, chalkEnvVar } from '../../../shared/chalk.js';
import { launchProcess } from '../../processes/process-list.js';
import featureHelp from '../get-webpack-features-help.js';

export default function registerCommand(cli: Yargs.Argv) {

  cli
    .command('build <parts...>', 'Builds the application', yargs => {
      yargs
        .positional('parts', {
          describe: 'the parts of the application that should be built',
          type: 'string',
          choices: ['client', 'server'],
        })
        .option(featureHelp)
        .parserConfiguration({
          'populate--': true,
        });
    }, argv => {
      const parts = argv.parts as string[];

      const env = process.env.NODE_ENV ?? 'production';

      logger.info(`Building ${parts.map(
        str => chalk.blue(str),
      ).join(', ')} in ${chalkEnvVar(env)} mode...`);

      for (const part of parts) {
        switch (part) {
          case 'client':
            // !TODO: pass extra argv ([--])
            launchProcess('buildClient', {
              env,
              argv: [],
            });
            break;

          case 'server':
            // !TODO: pass extra argv ([--])
            launchProcess('buildServer', {
              env,
              argv: [],
            });
            break;

          default:
            throw new Error(`Unknown part ${part}`);
        }
      }
    });
}
