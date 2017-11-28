// @flow

import childProcess from 'child_process';
import chalk from 'chalk';
import logger from '../../../shared/logger';
import builders from '../../webpack/builders';
import featureHelp from '../get-webpack-features-help';

chalk.enabled = true;

export default function registerCommand(commander) {

  commander
    .command('build <parts...>')
    .option(...featureHelp)
    .description('Builds the application')
    .action(parts => {

      for (const part of parts) {
        if (!Object.prototype.hasOwnProperty.call(builders, part)) {
          throw new TypeError(`Invalid builder ${part}, must be one of ${Object.keys(builders).join(', ')}`);
        }
      }

      logger.info(`Building ${parts.map(str => chalk.blue(str)).join(', ')} in ${chalk.magenta(process.env.NODE_ENV)} mode...`);

      process.env.WATCH = false;


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
