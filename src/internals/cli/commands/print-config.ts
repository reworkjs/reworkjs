import frameworkConfig from '@reworkjs/core/_internal_/framework-config';
import logger from '@reworkjs/core/logger';
import noop from 'lodash/noop.js';
import type Yargs from 'yargs';

export default function registerCommand(cli: Yargs.Argv) {
  cli
    .command('print-config', 'Prints out the parsed configuration of the framework', noop, () => {
      logger.info('framework configuration:');
      logger.info(`\n${JSON.stringify(frameworkConfig, null, 2)}`);
    });
}
