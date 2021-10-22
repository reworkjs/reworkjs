import BaseFeature from '../BaseFeature';
import type WebpackConfigBuilder from '../WebpackConfigBuilder';

export default class AnalyzeFeature extends BaseFeature {

  getFeatureName() {
    return 'analyze';
  }

  getDescription() {
    return 'Launches a view displaying the contents of the bundle in an interactive way. Great for debugging.';
  }

  isDefaultEnabled() {
    return false;
  }

  visit(webpack: WebpackConfigBuilder) {
    const BundleAnalyzerPlugin = this.getOptionalDependency('webpack-bundle-analyzer').BundleAnalyzerPlugin;

    webpack.injectPlugins(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      openAnalyzer: true,
      generateStatsFile: true,
      statsFilename: 'report.json',
      statsOptions: 'verbose',
    }));
  }
}
