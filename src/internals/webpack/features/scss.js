// @flow

import BaseFeature from '../BaseFeature';
import type WebpackConfigBuilder from '../WebpackConfigBuilder';
import PostCssFeature from './postcss';

export default class ScssFeature extends BaseFeature {

  loadBefore(): ?string {
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
