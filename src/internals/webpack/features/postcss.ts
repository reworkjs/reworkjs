import BaseFeature from '../BaseFeature.js';
import type WebpackConfigBuilder from '../WebpackConfigBuilder.js';

export default class PostCssFeature extends BaseFeature {

  getFeatureName(): string {
    return 'postcss';
  }

  getDescription() {
    return 'Enables PostCss support on any CSS file.';
  }

  visit(webpack: WebpackConfigBuilder) {
    webpack.injectCssLoader('postcss-loader');
  }
}
