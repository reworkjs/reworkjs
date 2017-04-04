import BaseFeature from '../BaseFeature';

export default class AnalyzeFeature extends BaseFeature {

  getFeatureName() {
    return 'analyze';
  }

  isEnabled(enabled = false) {
    if (this.isServer()) {
      return false;
    }

    return enabled;
  }

  visit(webpack) {
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
