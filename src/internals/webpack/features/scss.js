import BaseFeature from '../BaseFeature';
import PostCssFeature from './postcss';

export default class ScssFeature extends BaseFeature {

  loadBefore() {
    return PostCssFeature.prototype.getFeatureName();
  }

  getFeatureName() {
    return 'scss';
  }

  visit(webpack) {
    webpack.registerFileType(BaseFeature.FILE_TYPE_CSS, 'scss');
    webpack.registerFileType(BaseFeature.FILE_TYPE_CSS, 'sass');

    webpack.injectCssLoader('sass-loader');
  }
}
