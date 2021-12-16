import type { ChildProcess } from 'child_process';
import childProcess from 'child_process';
import logger from '@reworkjs/core/logger';
import type Yargs from 'yargs';
import { chalk, chalkEnvVar } from '../../../shared/chalk.js';
import builders from '../../webpack/builders.js';
import featureHelp from '../get-webpack-features-help.js';

export default function registerCommand(cli: Yargs.Argv) {

  cli
    .command('build <parts...>', 'Builds the application', yargs => {
      yargs
        .positional('parts', {
          describe: 'the parts of the application that should be built',
          type: 'string',
          choices: Object.keys(builders),
        })
        .option(featureHelp)
        .parserConfiguration({
          'populate--': true,
        });
    }, argv => {
      const parts = argv.parts as string[];

      logger.info(`Building ${parts.map(
        str => chalk.blue(str),
      ).join(', ')} in ${chalkEnvVar(process.env.NODE_ENV)} mode...`);

      process.env.WATCH = 'false';

      // if more than one builder, run them in separate processes
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];

        if (!(part in builders)) {
          throw new Error(`Unknown part ${part}`);
        }

        forkNamedProcess(part);
      }

      // run first builder in this process.
      // @ts-expect-error
      import(builders[parts[0]]);
    });
}

function forkNamedProcess(processName: string): ChildProcess {
  if (!(processName in builders)) {
    throw new Error(`Unknown part ${processName}`);
  }

  // @ts-expect-error
  const builderPath = builders[processName];

  return forkProcess(builderPath);
}

function forkProcess(builderPath: string): ChildProcess {
  return childProcess.fork(builderPath, process.argv, {
    env: Object.create(process.env),
  });
}
