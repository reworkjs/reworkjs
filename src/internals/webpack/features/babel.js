import findCacheDir from 'find-cache-dir';
import findBabelConfig from 'find-babel-config';
import frameworkMetadata from '../../../shared/framework-metadata';
import { resolveProject } from '../../util/resolve-util';
import { getDefault } from '../../../shared/util/ModuleUtil';
import BaseFeature from '../BaseFeature';

export default class BabelFeature extends BaseFeature {

  getFeatureName() {
    return 'babel';
  }

  getDescription() {
    return 'Transpiles JavaScript into ES5';
  }

  visit(webpack) {
    webpack.injectRules({
      test: BaseFeature.FILE_TYPE_JS,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: this.getTransformedBabelConfig(),
    });
  }

  getTransformedBabelConfig() {
    const config = this.getBabelConfig();

    // use the app's .babelrc
    if (!config) {
      return config;
    }

    if (this.isDev()) {
      config.presets.push('react-hmre');
    }

    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching build results in ./node_modules/.cache/reworkjs/babel
    // directory for faster rebuilds. We use findCacheDir() because of:
    // https://github.com/facebookincubator/create-react-app/issues/483
    config.cacheDirectory = `${findCacheDir({
      name: frameworkMetadata.name,
    })}/babel`;

    return config;
  }

  getBabelConfig() {
    // FIXME note: might break with Babel 7 due to new support for babelrc.js
    const { config } = findBabelConfig.sync(resolveProject('.'));

    if (config == null) {
      return getDefault(this.getOptionalDependency('@reworkjs/babel-preset-reworkjs'))();
    }

    // no need to load it, babel will do it on its own.
    return null;
  }
}
