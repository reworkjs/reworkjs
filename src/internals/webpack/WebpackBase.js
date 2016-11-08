import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import postCssNext from 'postcss-cssnext';
import postCssFocus from 'postcss-focus';
import postCssReporter from 'postcss-reporter';
import cheerio from 'cheerio';
import { requireRawRoot, resolveFramework, resolveRoot } from '../util/RequireUtil';
import frameworkConfig from '../config/framework-config';
import { isDev, isTest } from '../../shared/EnvUtil';
import logger from '../../shared/logger';

const rawFrameworkBabelRc = requireRawRoot('.babelrc');

function fixBabelConfig(babelConfig) {
  for (const key of Object.keys(babelConfig)) {
    const val = babelConfig[key];

    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        if (val[i] === 'es2015') {
          val[i] = ['es2015', { modules: false }];
        }
      }
    } else if (val && typeof val === 'object') {
      fixBabelConfig(val);
    }
  }

  return babelConfig;
}

export default class WebpackBase {

  static SIDE_SERVER = 0;
  static SIDE_CLIENT = 1;

  isDev: boolean;
  isTest: boolean;
  cssLoaders: { test: string, loaders: string[] }[] = [];

  constructor(side: number) {
    this.isDev = isDev;
    this.isTest = isTest;
    this.side = side;

    this.addCssLoader('css', [
      this.cssLoaderModule,
      'postcss-loader',
    ]);
  }

  get cssLoaderModule() {
    const cssOptions = 'css-loader?modules&importLoaders=1';
    if (this.isDev) {
      return `${cssOptions}&localIdentName=[local]__[path][name]__[hash:base64:5]&sourceMap`;
    }

    // disable cssnano removing deprecated prefixes.
    return `${cssOptions}&-autoprefixer`;
  }

  buildConfig() {
    const config = {
      name: this.isServer() ? 'Server' : 'Client',
      entry: this.getEntry(),
      output: this.getOutput(),
      module: {
        loaders: this.buildLoaders(),
      },
      plugins: this.getPlugins(),
      postCss: () => this.postCss(),
      devtool: this.getDevTools(),
      target: this.getTarget(),
      stats: false,
      progress: true,
      debug: true,
      resolve: {
        modules: ['node_modules'],
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
        alias: this.getAliases(),
      },
    };

    if (this.isServer()) {
      config.externals = [
        /^[a-z\-0-9]+$/,
        /\.json$/,
      ];
    }

    return config;
  }

  buildLoaders() {

    return [{
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: fixBabelConfig(this.getBabelConfig()),
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
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    }].concat(this.buildCssLoaders());
  }

  buildCssLoaders() {
    const loaders = [];

    for (const cssLoader of this.cssLoaders) {
      const loader = {};
      loader.test = cssLoader.test;
      loader.exclude = /node_modules/;

      if (this.isDev) {
        loader.loaders = ['style-loader', ...cssLoader.loaders];
      } else {
        loader.loader = ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: cssLoader.loaders,
        });
      }

      loaders.push(loader);
    }

    return loaders;
  }

  getEntry(): string[] {
    // front-end entry point.
    const entry = [
      this.isServer()
        ? resolveFramework('server/index')
        : resolveFramework('client/index'),
    ];

    if (this.isDev) {
      entry.unshift(
        // Necessary for hot reloading with IE
        require.resolve('eventsource-polyfill'),
        require.resolve('webpack-hot-middleware/client'),
        resolveRoot('lib/internals/dev-preamble.js'),
      );
    }

    return entry;
  }

  getOutput() {
    // Output to build directory.
    const output = {
      path: `${frameworkConfig.directories.build}/webpack-${this.isServer() ? 'server' : 'client'}`,
      publicPath: '/',
    };

    if (this.isServer()) {
      output.libraryTarget = 'commonjs2';
    }

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

    return output;
  }

  getTarget() {
    return this.isServer() ? 'node' : 'web';
  }

  getDevTools() {
    return this.isDev ? 'cheap-module-eval-source-map' : null;
  }

  getAliases() {
    return {
      '@@directories.routes': frameworkConfig.directories.routes,
      '@@main-component': frameworkConfig['entry-react'],
      '@@pre-init': frameworkConfig['pre-init'],
      '@@directories.providers': frameworkConfig.directories.providers,
    };
  }

  addCssLoader(fileExt: string | RegExp, loaders: string[]) {
    if (typeof fileExt === 'string') {
      fileExt = new RegExp(`\\.${fileExt}$`);
    }

    this.cssLoaders.push({
      test: fileExt,
      loaders,
    });
  }

  getPlugins() {
    const plugins = [
      new webpack.ProvidePlugin({
        fetch: 'exports?self.fetch!whatwg-fetch',
      }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
        frameworkConfig,
      }),
    ];

    if (this.isDev) {
      plugins.push(
        // enable hot reloading.
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),

        // Inject webpack bundle into HTML.
        new HtmlWebpackPlugin({
          inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
          templateContent: templateContent(), // eslint-disable-line no-use-before-define
        }),
      );
    } else {
      plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          children: true,
          minChunks: 2,
          async: true,
        }),

        new HtmlWebpackPlugin({
          template: frameworkConfig['entry-html'],
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
          inject: true,
        }),

        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false, // ...but do not show warnings in the console (there is a lot of them)
          },
        }),

        new webpack.optimize.DedupePlugin(),

        // OccurrenceOrderPlugin is needed for long-term caching to work properly.
        // See http://mxs.is/googmv
        new webpack.optimize.OccurrenceOrderPlugin(true),

        // Extract the CSS into a seperate file
        new ExtractTextPlugin('[name].[contenthash].css'),

        // Put it in the end to capture all the HtmlWebpackPlugin's
        // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
        new OfflinePlugin({
          relativePaths: false,
          publicPath: '/',

          // No need to cache .htaccess. See http://mxs.is/googmp,
          // this is applied before any match in `caches` section
          excludes: ['.htaccess'],

          caches: {
            main: [':rest:'],

            // All chunks marked as `additional`, loaded after main section
            // and do not prevent SW to install. Change to `optional` if
            // do not want them to be preloaded at all (cached only when first loaded)
            additional: ['*.chunk.js'],
          },

          // Removes warning for about `additional` section usage
          safeToUseOptionalCaches: true,

          AppCache: false,
        }),
      );
    }

    return plugins;
  }

  getBabelConfig() {
    // TODO load app .babelrc AND  disable autoloading
    const config = JSON.parse(rawFrameworkBabelRc);
    config.plugins = config.plugins || [];

    if (this.isDev) {
      config.presets.push('react-hmre');
    }

    return config;
  }

  getPostCssPlugins() {
    return [
      // Add a :focus to every :hover
      postCssFocus(),

      // Allow future CSS features to be used, also auto-prefixes the CSS...
      postCssNext({
        browsers: ['last 2 versions', 'IE > 10'],
      }),

      // Posts messages from plugins to the terminal
      postCssReporter({
        clearMessages: true,
      }),
    ];
  }

  isServer() {
    return this.side === WebpackBase.SIDE_SERVER;
  }
}

/**
 * We dynamically generate the HTML content in development so that the different
 * DLL Javascript files are loaded in script tags and available to our application.
 */
function templateContent() {

  const html = fs.readFileSync(frameworkConfig['entry-html']).toString();

  const doc = cheerio(html);
  const body = doc.find('body');
  if (body.length === 0) {
    throw new Error('Your HTML entry point does not contain a <body>.');
  }

  const appDiv = doc.find('#app');
  if (appDiv.length === 0) {
    logger.info('Could not find #app in html entry point, inserting it.');
    body.append('<div id="#app"></div>');
  }

  // const body = doc.find('body');
  // const dllNames = !dllPlugin.dlls ? ['frameworkDependencies'] : Object.keys(dllPlugin.dlls);
  // dllNames.forEach(dllName => body.append(`<script data-dll='true' src='/${dllName}.dll.js'></script>`));

  return doc.toString();
}
