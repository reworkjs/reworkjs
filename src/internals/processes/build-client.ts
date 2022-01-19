import logger from '@reworkjs/core/logger';
import { chalkUrl } from '../../shared/chalk.js';
import compileWebpack from '../webpack/compile-webpack.js';
import clientWebpackConfig from '../webpack/webpack.client.js';

logger.info('Building your client-side app, this might take a minute.');

compileWebpack(clientWebpackConfig, false, () => {
  logger.info(`Client outputted at ${chalkUrl(clientWebpackConfig.output.path)}.`);
});
