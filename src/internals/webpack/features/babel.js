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
      options: {
        sourceType: 'module',
        ...this.getProjectBabelConfig(),

        babelrc: false,
        configFile: false,

        // Cache build results in ./node_modules/.cache/reworkjs/babel.
        // We use findCacheDir() because of:
        // https://github.com/facebookincubator/create-react-app/issues/483
        cacheDirectory: findCacheDir({
          name: `${frameworkMetadata.name}-babel-${this.getEnv()}-${this.getSideName()}`,
        }),
      },
    });

    // this is ran exclusively on node_modules to transpile valid ES features based on browserslistrc.
    webpack.injectRules({
      test: BaseFeature.FILE_TYPE_JS,
      loader: 'babel-loader',
      include: /node_modules/,

      // do not transpile @babel/runtime or core-js as babel-runtime-plugin will try to inject @babel/runtime inside it. Same for core-js.
      exclude: /(@babel\/runtime)|(core-js)/,

      options: {
        compact: true,
        sourceType: 'unambiguous',
        presets: ['@reworkjs/core/lib/internals/babel/global-babel-preset'],
        babelrc: false,

        // should we allow users to compile node_modules using babel.config.js? That'd require exposing a base preset
        // (@reworkjs/core/module-babel-preset?). Need to test performance.
        configFile: false,
        cacheDirectory: findCacheDir({
          name: `${frameworkMetadata.name}-babel_nm-${this.getEnv()}-${this.getSideName()}`,
        }),
      },
    });
  }

  getProjectBabelConfig() {
    const config = this.getBabelConfig();

    config.plugins = config.plugins || [];

    if (this.isDev()) {
      config.plugins.push('react-refresh/babel');
    }

    // support Loadable Components
    config.plugins.push('@loadable/babel-plugin');

    return config;
  }

  getBabelConfig(): Object {
    // FIXME need to find a way to support other kind of babel configs.
    const { config } = findBabelConfig.sync(resolveProject('.'));

    if (config == null) {
      return { presets: ['@reworkjs/core/babel-preset'] };
    }

    return config;
  }
}
