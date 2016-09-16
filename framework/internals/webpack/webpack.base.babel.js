/**
 * COMMON WEBPACK CONFIGURATION
 */

import path from 'path';
import webpack from 'webpack';
import mergeWith from 'lodash/mergeWith';
import { requireRawRoot } from '../../util/RequireUtil';

const babelRc = JSON.parse(requireRawRoot('.babelrc'));

export default function buildWebpackConfig(options) {

  const babelQuery = mergeWith(options.babelQuery, babelRc, (obj, src) => {
    if (Array.isArray(obj)) {
      return obj.concat(src);
    }
  });

  return {
    entry: options.entry,
    output: Object.assign({ // Compile into js/build.js
      path: path.resolve(process.cwd(), '.build'),
      publicPath: '/',
    }, options.output), // Merge with env dependent settings
    module: {
      loaders: [{
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        loader: 'babel',
        exclude: /node_modules/,
        query: babelQuery,
      }, {
        // Transpile scss files.
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: `${options.cssLoaders}!sass-loader`,
      }, {
        // Transform our own .s?css files with PostCSS and CSS-modules
        test: /\.css$/,
        exclude: /node_modules/,
        loader: options.cssLoaders,
      }, {
        // Do not transform vendor's CSS with CSS-modules
        // The point is that they remain in global scope.
        // Since we require these CSS files in our JS or CSS files,
        // they will be a part of our compilation either way.
        // So, no need for ExtractTextPlugin here.
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
      }, {
        test: /\.(jpg|png|gif)$/,
        loaders: [
          'file-loader',
          `image-webpack?{
            progressive:true, 
            optimizationLevel: 7, 
            interlaced: false, 
            pngquant: {
              quality: "65-90", 
              speed: 4
            }
          }`,
        ],
      }, {
        test: /\.html$/,
        loader: 'html-loader',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.(mp4|webm)$/,
        loader: 'url-loader?limit=10000',
      }],
    },
    plugins: options.plugins.concat([
      new webpack.ProvidePlugin({
        // make fetch available
        fetch: 'exports?self.fetch!whatwg-fetch',
      }),

      // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
      // inside your code for any environment checks; UglifyJS will automatically
      // drop any unreachable code.
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ]),
    postcss() {
      return options.postcssPlugins;
    },
    resolve: {
      modules: ['app', 'node_modules'],
      extensions: [
        '',
        '.js',
        '.jsx',
        '.react.js',
      ],
      mainFields: [
        'jsnext:main',
        'main',
      ],
    },
    devtool: options.devtool,
    target: 'web', // Make web variables accessible to webpack, e.g. window
    stats: false, // Don't show stats in the console
    progress: true,
  };
}
