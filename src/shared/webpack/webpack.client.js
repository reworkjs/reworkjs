import webpack from 'webpack';
import frameworkConfig from '../framework-config';
import WebpackBase from './WebpackBase';

const WebpackConfig = WebpackBase;

const webpackConfig = (new WebpackConfig(WebpackBase.SIDE_CLIENT)).buildConfig();

webpackConfig.plugins.push(
  new webpack.DllReferencePlugin({
    manifest: require(`${frameworkConfig.directories.build}/dll/rjs.json`), // eslint-disable-line global-require
  }),
);

export default webpackConfig;
