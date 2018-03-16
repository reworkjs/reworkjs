// @flow

import chalk from 'chalk';
import logger from '../../shared/logger';
import WebpackConfigBuilder from './WebpackConfigBuilder';

export default class BaseFeature {

  static FILE_TYPE_JS = WebpackConfigBuilder.FILE_TYPE_JS;
  static FILE_TYPE_CSS = WebpackConfigBuilder.FILE_TYPE_CSS;
  static FILE_TYPE_IMG = WebpackConfigBuilder.FILE_TYPE_IMG;

  _isServer: boolean;
  _env: string;

  constructor(isServer: boolean, env: string) {
    this._isServer = isServer;
    this._env = env;
  }

  getDescription(): string {
    return 'No description provided. Contact Feature author.';
  }

  getFeatureName(): string {
    throw new Error('getFeatureName not implemented');
  }

  loadAfter(): ?string {
    return null;
  }

  loadBefore(): ?string {
    return null;
  }

  isDefaultEnabled(): boolean {
    return true;
  }

  isDev(): boolean {
    return !this.isProd();
  }

  isProd(): boolean {
    return this._env === 'production';
  }

  isServer(): boolean {
    return this._isServer;
  }

  isClient(): boolean {
    return !this.isServer();
  }

  visit(webpack: WebpackConfigBuilder) { // eslint-disable-line
    throw new Error('visit not implemented');
  }

  getOptionalDependency(dependencyName: string) {
    try {
      // $FlowIgnore
      return require(dependencyName);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }

      logger.error(`Feature ${chalk.blue(this.getFeatureName())} is missing the dependency ${chalk.magenta(dependencyName)}. run ${chalk.magenta(`npm install ${dependencyName}`)}`);
      throw e;
    }
  }
}
