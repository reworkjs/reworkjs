// @flow

import findCacheDir from 'find-cache-dir';
import findBabelConfig from 'find-babel-config';
import frameworkMetadata from '../../../shared/framework-metadata';
import { resolveProject } from '../../util/resolve-util';
import BaseFeature from '../BaseFeature';
import type WebpackConfigBuilder from '../WebpackConfigBuilder';

export default class BabelFeature extends BaseFeature {

  getFeatureName() {
    return 'babel';
  }

  getDescription() {
    return 'Transpiles JavaScript based on what you support';
  }

  visit(webpack: WebpackConfigBuilder) {

    // this is ran exclusively on the project's source code
    webpack.injectRules({
      test: BaseFeature.FILE_TYPE_JS,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: this.getProjectBabelConfig(),
    });

    // this is ran exclusively on node_modules to transpile valid ES features based on browserslistrc.
    webpack.injectRules({
      test: BaseFeature.FILE_TYPE_JS,
      loader: 'babel-loader',
      include: /node_modules/,
      options: {
        presets: ['@reworkjs/reworkjs/lib/internals/babel/global-babel-preset'],
      },
    });
  }

  getProjectBabelConfig() {
    const config = this.getBabelConfig();

    config.babelrc = false;

    if (this.isDev()) {
      config.plugins.push('react-hot-loader/babel');
    }

    // Cache build results in ./node_modules/.cache/reworkjs/babel.
    // We use findCacheDir() because of:
    // https://github.com/facebookincubator/create-react-app/issues/483
    config.cacheDirectory = `${findCacheDir({
      name: frameworkMetadata.name,
    })}/babel`;

    return config;
  }

  getBabelConfig(): Object {
    // FIXME need to find a way to support other kind of babel configs.
    const { config } = findBabelConfig.sync(resolveProject('.'));

    if (config == null) {
      return { presets: ['@reworkjs/reworkjs/babel-preset'] };
    }

    return config;
  }
}
