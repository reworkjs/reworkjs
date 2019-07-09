import { chalkUrl } from '../../shared/chalk';
import logger from '../../shared/logger';
import clientWebpackConfig from './webpack.client';
import compileWebpack from './compile-webpack';

logger.info('Building your client-side app, this might take a minute.');

if (process.env.WATCH === 'true') {
  import('./build-webpack-client-watch');
} else {
  compileWebpack(clientWebpackConfig, false, () => {
    logger.info(`Client outputted at ${chalkUrl(clientWebpackConfig.output.path)}.`);
  });
}
