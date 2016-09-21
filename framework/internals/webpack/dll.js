/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

import { join } from 'path';
import defaults from 'lodash/defaultsDeep';
import webpack from 'webpack';
import ReactBoilerplate from '../config';

const pkg = require(join(process.cwd(), 'package.json'));
const dllPlugin = ReactBoilerplate.dllPlugin;

if (!pkg.dllPlugin) { process.exit(0); }

const dllConfig = defaults(pkg.dllPlugin, dllPlugin.defaults);
const outputPath = join(process.cwd(), dllConfig.path);

export default {
  context: process.cwd(),
  entry: dllConfig.dlls ? dllConfig.dlls : dllPlugin.entry(pkg),
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
        `image-webpack?{
          progressive: true, 
          optimizationLevel: 7, 
          interlaced: false, 
          pngquant:{
            quality: "65-90", 
            speed: 4
          }
        }`,
      ],
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
  plugins: [
    new webpack.DllPlugin({ name: '[name]', path: join(outputPath, '[name].json') }), // eslint-disable-line no-new
  ],
};
