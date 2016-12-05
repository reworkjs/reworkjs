/* eslint-disable no-process-env */
import logger from './logger';

// 'process.env' will be replaced by webpack with the actual contents of process.env on the browser build
// so it can be accessed on the client.
// process.env.NODE_ENV
const env = process.env;
env.NODE_ENV = env.NODE_ENV || 'production';

if (typeof process.env.BUILD_ENV !== 'undefined') {
  // BUILD_ENV is the environment for which this build was created (if its production, we're in a minified build).
  if (env.NODE_ENV !== process.env.BUILD_ENV) {
    logger.warn(`You're running a ${process.env.BUILD_ENV} build in a ${env.NODE_ENV} environment.`);
  }
}

export default env;
