import BaseFeature from '../BaseFeature';

export default class PostCssFeature extends BaseFeature {

  getFeatureName() {
    return 'postcss';
  }

  getDescription() {
    return 'Enables PostCss support on any CSS file.';
  }

  visit(webpack) {
    webpack.injectCssLoader('postcss-loader');
  }
}
