// @flow

import childProcess from 'child_process';
import { chalk, chalkEnvVar } from '../../../shared/chalk';
import logger from '../../../shared/logger';
import builders from '../../webpack/builders';
import featureHelp from '../get-webpack-features-help';

export default function registerCommand(commander) {

  commander
    .command('build <parts...>', 'Builds the application', yargs => {
      yargs
        .positional('parts', {
          describe: 'the parts of the application that should be built',
          type: 'string',
          choices: Object.keys(builders),
        })
        .option(...featureHelp)
        .parserConfiguration({
          'populate--': true,
        });
    }, argv => {
      const parts = argv.parts;

      logger.info(`Building ${parts.map(
        str => chalk.blue(str),
      ).join(', ')} in ${chalkEnvVar(process.env.NODE_ENV)} mode...`);

      process.env.WATCH = 'false';

      // if more than one builder, run them in separate processes
      for (let i = 1; i < parts.length; i++) {
        runProcess(builders[parts[i]]);
      }

      // run first builder in this process.
      const syncBuilder = builders[parts[0]];

      // $FlowIgnore
      import(syncBuilder);
    });
}

function runProcess(builderPath) {
  childProcess.fork(builderPath, process.argv, {
    env: Object.create(process.env),
  });
}
