import chalk from 'chalk';
import logger from '../../shared/logger';
import WebpackConfigBuilder from './WebpackConfigBuilder';

export default class BaseFeature {

  static FILE_TYPE_JS = WebpackConfigBuilder.FILE_TYPE_JS;
  static FILE_TYPE_CSS = WebpackConfigBuilder.FILE_TYPE_CSS;
  static FILE_TYPE_IMG = WebpackConfigBuilder.FILE_TYPE_IMG;

  constructor(isServer, env) {
    this._isServer = isServer;
    this._env = env;
  }

  getFeatureName() {
    throw new Error('getFeatureName not implemented');
  }

  loadAfter() {
    return null;
  }

  loadBefore() {
    return null;
  }

  isEnabled(enabled) {
    if (enabled === void 0) {
      return true;
    }

    return enabled;
  }

  isDev() {
    return !this.isProd();
  }

  isProd() {
    return this._env === 'production';
  }

  isServer() {
    return this._isServer;
  }

  isClient() {
    return !this.isServer();
  }

  visit(webpack: WebpackConfigBuilder) { // eslint-disable-line
    throw new Error('visit not implemented');
  }

  getOptionalDependency(dependencyName) {
    try {
      // TODO auto-install ?
      return require(dependencyName); // eslint-disable-line
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }

      logger.error(`Feature ${chalk.blue(this.getFeatureName())} is missing the dependency ${chalk.magenta(dependencyName)}.`);
      throw e;
    }
  }
}
