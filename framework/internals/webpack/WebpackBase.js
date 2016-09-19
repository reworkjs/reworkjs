import webpack from 'webpack';
import { requireRawRoot, resolveProject, resolveRoot } from '../../util/RequireUtil';
import frameworkConfig from '../../server/framework-config';

const frameworkBabelRc = JSON.parse(requireRawRoot('.babelrc'));

export default class WebpackBase {

  isDev: boolean;

  constructor(isDev) {
    this.isDev = isDev;
  }

  getEntry(): string[] {
    // front-end entry point.
    const entry = [resolveRoot('framework/kernel')];

    if (this.isDev) {
      entry.unshift(
        // Necessary for hot reloading with IE
        require.resolve('eventsource-polyfill'),
        require.resolve('webpack-hot-middleware/client'),
        resolveRoot('internals/dev-preamble.js'),
      );
    }
  }

  getOutput() {
    const output = {
      path: resolveProject(frameworkConfig.directories.build),
      publicPath: '/',
    };

    if (this.isDev) {
      // Don't use hashes in dev mode for better performance
      Object.assign(output, {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',

        // https://github.com/mxstbr/react-boilerplate/issues/443
        // publicPath: 'http://localhost:3000',
      });
    } else {
      // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
      Object.assign(output, {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
      });
    }
  }

  getBabelConfig() {
    return frameworkBabelRc;
  }

  getCssLoaders(): string[] {
    return [
      'style-loader',
      'css-loader?localIdentName=[local]__[path][name]__[hash:base64:5]&modules&importLoaders=1&sourceMap',
      'postcss-loader',
    ];
  }
}

/**
 * Builds the base configuration for Webpack.
 * @param options - The list of options.
 * @returns The webpack config.
 */
function buildWebpackConfig(options) {

  return {
    entry: options.entry,
    module: {
      loaders: [{
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        loader: 'babel',
        exclude: /node_modules/,
        query: babelQuery,
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
