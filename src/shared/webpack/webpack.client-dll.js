import path from 'path';
import webpack from 'webpack';

import frameworkConfig from '../framework-config';
import WebpackBase from './WebpackBase';

const WebpackConfig = /* frameworkConfig.webpack ? require(frameworkConfig.webpack) : */ WebpackBase;

const webpackConfig = (new WebpackConfig(WebpackBase.SIDE_CLIENT)).buildConfig();

webpackConfig.output = {
  filename: '[name].dll.js',
  path: `${frameworkConfig.directories.build}/dll`,
  library: '[name]',
};

webpackConfig.entry = {
  rjs: frameworkConfig.dlls,
};

webpackConfig.plugins.push(
  new webpack.DllPlugin({ name: '[name]', path: path.join(webpackConfig.output, '[name].json') }),
);

export default webpackConfig;
