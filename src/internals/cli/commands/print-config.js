import frameworkConfig from '../../../shared/framework-config';
import logger from '../../../shared/logger';

export default function registerCommand(commander) {

  commander
    .command('print-config')
    .description('Prints out the parsed configuration of the framework')
    .action(() => {
      logger.debug(JSON.stringify(frameworkConfig, null, 2));
    });
}
