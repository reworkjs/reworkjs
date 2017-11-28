// @flow

import { noop } from 'lodash';
import frameworkConfig from '../../../shared/framework-config';
import logger from '../../../shared/logger';

export default function registerCommand(commander) {

  commander
    .command('print-config', 'Prints out the parsed configuration of the framework', noop, () => {
      logger.info('framework configuration:');
      logger.info(`\n${JSON.stringify(frameworkConfig, null, 2)}`);
    });
}
