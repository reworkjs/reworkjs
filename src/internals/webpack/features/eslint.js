// @flow

import BaseFeature from '../BaseFeature';
import type WebpackConfigBuilder from '../WebpackConfigBuilder';

export default class EslintFeature extends BaseFeature {

  getFeatureName() {
    return 'eslint';
  }

  getDescription() {
    return 'Validates your source-code when building';
  }

  isDefaultEnabled() {
    return false;
  }

  visit(webpack: WebpackConfigBuilder) {
    webpack.injectRules({
      enforce: 'pre',
      test: BaseFeature.FILE_TYPE_JS,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        rules: {
          'no-console': 0,
          'no-debugger': 0,
        },
      },
    });
  }
}
