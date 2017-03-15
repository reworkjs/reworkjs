import '../../shared/regenerator';
import logger from '../../shared/logger';

process.env.PROCESS_NAME = 'Server';

logger.info('Building your client-side app, this might take a minute.');

if (process.env.NODE_ENV === 'development') {
  require('./build-webpack-client-dev'); // eslint-disable-line
}
