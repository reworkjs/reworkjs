import logger from '@reworkjs/core/logger';
import { chalkUrl } from '../../shared/chalk.js';
import compileWebpack from './compile-webpack.js';
import clientWebpackConfig from './webpack.client.js';

logger.info('Building your client-side app, this might take a minute.');

if (process.env.WATCH === 'true') {
  import('./build-webpack-client-watch.js');
} else {
  compileWebpack(clientWebpackConfig, false, () => {
    logger.info(`Client outputted at ${chalkUrl(clientWebpackConfig.output.path)}.`);
  });
}
