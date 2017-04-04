import BaseFeature from '../BaseFeature';

export default class PostCssFeature extends BaseFeature {

  getFeatureName() {
    return 'postcss';
  }

  visit(webpack) {
    webpack.injectCssLoader('postcss-loader');
  }
}
