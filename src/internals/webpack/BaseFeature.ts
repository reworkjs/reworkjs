import logger from '@reworkjs/core/logger';
import { chalkCommand, chalkWebpackFeature, chalkNpmDep } from '../../shared/chalk.js';
import WebpackConfigBuilder from './WebpackConfigBuilder.js';

export default abstract class BaseFeature {

  static FILE_TYPE_JS = WebpackConfigBuilder.FILE_TYPE_JS;
  static FILE_TYPE_CSS = WebpackConfigBuilder.FILE_TYPE_CSS;
  static FILE_TYPE_IMG = WebpackConfigBuilder.FILE_TYPE_IMG;

  _isServer: boolean;
  _env: string;

  constructor(isServer: boolean, env: string) {
    this._isServer = isServer;
    this._env = env;
  }

  abstract getDescription(): string;

  abstract getFeatureName(): string;

  loadAfter(): string | null {
    return null;
  }

  loadBefore(): string | null {
    return null;
  }

  isDefaultEnabled(): boolean {
    return true;
  }

  isDev(): boolean {
    return !this.isProd();
  }

  getEnv() {
    return this._env || 'production';
  }

  getSideName() {
    return this.isServer() ? 'SSR' : 'Client';
  }

  isProd(): boolean {
    return this.getEnv() === 'production';
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
      return require(dependencyName);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }

      logger.error(`Feature ${chalkWebpackFeature(this.getFeatureName())} is missing the dependency ${chalkNpmDep(dependencyName)}. run ${chalkCommand(`npm install ${dependencyName}`)}`);
      throw e;
    }
  }
}
