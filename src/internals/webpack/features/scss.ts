import BaseFeature from '../BaseFeature.js';
import type WebpackConfigBuilder from '../WebpackConfigBuilder.js';
import PostCssFeature from './postcss.js';

export default class ScssFeature extends BaseFeature {

  loadBefore(): string | null {
    return PostCssFeature.prototype.getFeatureName();
  }

  getFeatureName() {
    return 'scss';
  }

  getDescription() {
    return 'Enables SCSS support';
  }

  visit(webpack: WebpackConfigBuilder) {
    webpack.registerFileType(BaseFeature.FILE_TYPE_CSS, 'scss');
    webpack.registerFileType(BaseFeature.FILE_TYPE_CSS, 'sass');

    webpack.injectCssLoader('sass-loader');
  }
}
