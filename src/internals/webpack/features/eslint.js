import BaseFeature from '../BaseFeature';

export default class EslintFeature extends BaseFeature {

  getFeatureName() {
    return 'eslint';
  }

  isEnabled(enabled) {
    if (!this.isDev()) {
      return false;
    }

    return super.isEnabled(enabled);
  }

  visit(webpack) {
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
