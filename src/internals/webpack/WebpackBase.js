import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import nodeExternals from 'webpack-node-externals';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import findCacheDir from 'find-cache-dir';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import frameworkConfig from '../../shared/framework-config';
import projectMetadata from '../../shared/project-metadata';
import frameworkMetadata from '../../shared/framework-metadata';
import frameworkBabelRc from '../../shared/framework-babelrc';
import { resolveRoot, resolveFrameworkSource } from '../../shared/resolve';
import { isDev, isTest } from '../../shared/EnvUtil';
import getWebpackSettings from '../../shared/webpack-settings';
import BaseHelmet from '../../framework/app/BaseHelmet';
import renderPage from '../../framework/server/setup-http-server/render-page';
import DumpEntryPointsPlugin from './DumpEntryPointsPlugin';

const ANY_MODULE_EXCEPT_FRAMEWORK = new RegExp(`node_modules\\/(?!${frameworkMetadata.name})`);

function replaceBabelPreset(babelConfig) {

  for (const key of Object.keys(babelConfig)) {
    const val = babelConfig[key];

    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        if (val[i] === 'es2015') {
          val[i] = ['es2015', { modules: false }];
        }
      }
    } else if (val && typeof val === 'object') {
      replaceBabelPreset(val);
    }
  }

  return babelConfig;
}

export default class WebpackBase {

  static SIDE_SERVER = 0;
  static SIDE_CLIENT = 1;

  isDev: boolean;
  isTest: boolean;

  constructor(side: number) {
    this.isDev = isDev;
    this.isTest = isTest;
    this.side = side;
  }

  buildCssLoader(options = {}) {
    const loaderOptions = {
      importLoaders: options.importLoaders || 1,
    };

    if (this.isDev) {
      Object.assign(loaderOptions, {
        localIdentName: '[local]__[hash:base64:5]',
        sourceMap: true,
      });
    } else {
      Object.assign(loaderOptions, {
        minimize: true, // TODO cssnano options
      });
    }

    if (options.modules) {
      Object.assign(loaderOptions, {
        modules: true,
        camelCase: true,
      });
    }

    return {
      loader: 'css-loader',
      options: loaderOptions,
    };
  }

  buildConfig() {
    const config = {
      cache: true,
      name: this.isServer() ? 'Server' : 'Client',
      entry: this.getEntry(),
      output: this.getOutput(),
      module: {
        rules: this.buildLoaders(),
      },
      plugins: this.getPlugins(),
      devtool: this.getDevTools(),
      target: this.getTarget(),
      resolve: {
        modules: ['node_modules'],
        extensions: [
          '.js',
          '.jsx',
          '.react.js',
        ],
        mainFields: [
          'webpack:main',
          'jsnext:module',
          'module',
          'jsnext:main',
          'main',
        ],
        alias: this.getAliases(),
      },
      performance: {
        hints: this.isDev || this.isServer() ? false : 'warning',
      },
    };

    if (this.isServer()) {
      // exclude any absolute module (npm/node) from the build, except this module.
      // this module must be included otherwise the server build will have two
      // separate versions of the framework loaded.
      // const anyAbsoluteExceptFrameworkAndCss = new RegExp(`^(?!${}(\\/.+)?$)[a-z\\-_0-9]+(?!.+\\.css$).+$`);

      config.externals = [
        nodeExternals({
          whitelist: [
            // 'webpack/hot/signal',
            new RegExp(`^${frameworkMetadata.name}`),
            /\.css$/i,
          ],
        }),
        // anyAbsoluteExceptFrameworkAndCss,
      ];
    } else {
      config.resolve.mainFields.unshift('web');
      config.resolve.mainFields.unshift('jsnext:web');
      config.resolve.mainFields.unshift('browser');
      config.resolve.mainFields.unshift('jsnext:browser');
    }

    return config;
  }

  buildLoaders() {

    /*
     * Supported file formats:
     * - GIF
     * - JPEG/JPG
     * - PNG
     * - WebP
     * - SVG
     */

    // TODO consider using url-loader rather than file-loader maybe ?
    // Need to test perf gain.

    const rules = [{
      test: /\.jsx?$/i,
      loader: 'babel-loader',
      exclude: ANY_MODULE_EXCEPT_FRAMEWORK,
      options: replaceBabelPreset(this.getBabelConfig()),
    }, {
      test: /\.(eot|ttf|woff|woff2)(\?.*$|$)/i,
      loader: 'file-loader',
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        require.resolve('./global-srcset-loader'),
        'file-loader',
        {
          loader: 'image-webpack-loader',
          query: {
            bypassOnDebug: true,
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            },
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
            svgo: {},
          },
        },
      ],
    }, {
      test: /\.webp/i,
      loader: 'file-loader',
    }, {
      test: /\.json$/i,
      loader: 'json-loader',
    }, {
      test: /\.html$/i,
      loader: 'html-loader',
    }, {
      test: /\.(mp4|webm)$/i,
      loader: 'url-loader?limit=10000',
    }].concat(this.buildCssLoaders());

    if (this.isDev) {
      rules.push({
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          rules: {
            'no-console': 0,
            'no-debugger': 0,
          },
        },
        enforce: 'pre',
      });
    }

    return rules;
  }

  buildCssLoaders() {
    const cssLoaders = [{
      test: /\.(sc|sa|c)ss$/i,
      exclude: ANY_MODULE_EXCEPT_FRAMEWORK,
      use: [this.buildCssLoader({ modules: true, importLoaders: 2 }), 'postcss-loader', 'sass-loader'],
    }, {
      test: /\.css$/i,
      include: ANY_MODULE_EXCEPT_FRAMEWORK,
      use: [this.buildCssLoader({ modules: false })],
    }];

    const styleLoader = this.isServer() ? 'node-style-loader' : 'style-loader';
    for (const cssLoader of cssLoaders) {
      if (this.isDev) {
        cssLoader.use = [styleLoader, ...cssLoader.use];
      } else {
        cssLoader.use = ExtractTextPlugin.extract({
          fallback: styleLoader,
          use: cssLoader.use,
        });
      }
    }

    return cssLoaders;
  }

  getEntry(): string[] {
    // front-end entry point.
    const entry = [
      this.isServer()
        ? resolveFrameworkSource('server/index')
        : resolveFrameworkSource('client/index'),
    ];

    // front-end dev libs.
    if (this.isDev && !this.isServer()) {
      entry.unshift(
        // Necessary for hot reloading with IE
        'eventsource-polyfill',
        'webpack-hot-middleware/client',
        require.resolve('./dev-preamble'),
      );
    } else if (this.isDev && this.isServer()) {
      entry.unshift(
        // hot reload if parent sends signal SIGUSR2
        require.resolve('./hmr-server'),
      );
    }

    return entry;
  }

  getPublicPath() {
    return '/';
  }

  getOutput(): Object {
    // Output to build directory.
    const output = getWebpackSettings(this.isServer()).output;

    if (this.isServer()) {
      output.libraryTarget = 'commonjs2';
    }

    if (this.isDev || this.isServer()) {
      // Don't use hashes in dev mode for better building performance.
      // Don't use them on the server because they're not needed and not user friendly.
      Object.assign(output, {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',

        // https://github.com/mxstbr/react-boilerplate/issues/443
        // publicPath: 'http://localhost:3000',
      });
    } else {
      // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets.
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
    return this.isDev ? 'cheap-module-eval-source-map' : 'source-map';
  }

  getAliases() {

    return {
      // Framework configuration directories
      '@@pre-init': frameworkConfig['pre-init'],
      '@@main-component': frameworkConfig['entry-react'],
      '@@directories.routes': frameworkConfig.directories.routes,
      '@@directories.translations': frameworkConfig.directories.translations,
      '@@directories.providers': frameworkConfig.directories.providers,
      [frameworkMetadata.name]: resolveRoot(''),

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    };
  }

  getDefinedVars() {
    const NODE_ENV = JSON.stringify(process.env.NODE_ENV);
    const SIDE = JSON.stringify(this.isServer() ? 'server' : 'client');
    const definePluginArg = {
      'process.env.BUILD_ENV': NODE_ENV, // eslint-disable-line no-process-env
      'process.env.SIDE': SIDE, // eslint-disable-line no-process-env
      webpack_globals: {
        PROCESS_NAME: JSON.stringify(`${projectMetadata.name} (${this.isServer() ? 'server' : 'client'})`),
        SIDE,
        PROJECT_DIR: JSON.stringify(process.cwd()),
        ROOT_DIR: JSON.stringify(path.resolve(__dirname, '../../..')),
      },
      frameworkConfig: JSON.stringify(frameworkConfig),
      frameworkBabelrc: JSON.stringify(frameworkBabelRc),
      projectMetadata: JSON.stringify(projectMetadata),
      frameworkMetadata: JSON.stringify(frameworkMetadata),
    };

    if (!this.isServer()) {
      definePluginArg['process.env'] = { NODE_ENV, SIDE };

      definePluginArg['process.argv'] = JSON.stringify(process.argv); // eslint-disable-line no-process-env
    }

    return definePluginArg;
  }

  getBundleSizeOptimisationPlugins() {
    return [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        children: true,
        minChunks: 2,
        async: true,
      }),

      new UglifyJsPlugin({
        // preserve LICENSE comments (*!, /**!, @preserve or @license) for legal stuff but extract them
        // to their own file to reduce bundle size.
        extractComments: true,
        sourceMap: true,
        compress: {
          warnings: false,
        },
      }),

      // OccurrenceOrderPlugin is needed for long-term caching to work properly.
      // See http://mxs.is/googmv
      new webpack.optimize.OccurrenceOrderPlugin(true),
    ];
  }

  getPlugins() {
    // TODO inject DLLs <script data-dll='true' src='/${dllName}.dll.js'></script>`
    // TODO https://github.com/diurnalist/chunk-manifest-webpack-plugin
    const plugins = [
      new webpack.DefinePlugin(this.getDefinedVars()),
      new CopyWebpackPlugin([{
        from: { glob: `${frameworkConfig.directories.resources}/**/**/*` },
        to: './',
        toType: 'dir',
      }]),

      // Inject webpack bundle into HTML.
      new HtmlWebpackPlugin({
        inject: true,
        templateContent: buildIndexPage(),
        minify: this.isDev ? false : {
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
      }),
    ];

    if (!this.isServer()) {
      plugins.push(
        new DumpEntryPointsPlugin(),
      );
    }

    if (this.isDev) {
      plugins.push(
        // enable hot reloading.
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),

        new webpack.NoEmitOnErrorsPlugin(),

        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),

        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebookincubator/create-react-app/issues/186
        // new WatchMissingNodeModulesPlugin(paths.appNodeModules), // TODO
      );
    }

    if (!this.isDev) {
      plugins.push(
        new WebpackCleanupPlugin({ quiet: true }),

        // Extract the CSS into a seperate file
        new ExtractTextPlugin('[name].[contenthash].css'),
      );
    }

    if (!this.isDev && !this.isServer()) {
      // only optimise the bundle size for the client in prod mode.
      plugins.push(...this.getBundleSizeOptimisationPlugins());

      plugins.push(
        // Put it in the end to capture all the HtmlWebpackPlugin's assets
        new OfflinePlugin({
          relativePaths: false,
          publicPath: this.getPublicPath(),

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
    const config = frameworkBabelRc;
    config.plugins = config.plugins || [];

    if (this.isDev) {
      config.presets.push('react-hmre');
    }

    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching build results in ./node_modules/.cache/reworkjs/babel
    // directory for faster rebuilds. We use findCacheDir() because of:
    // https://github.com/facebookincubator/create-react-app/issues/483
    config.cacheDirectory = `${findCacheDir({
      name: frameworkMetadata.name,
    })}/babel`;

    return config;
  }

  isServer() {
    return this.side === WebpackBase.SIDE_SERVER;
  }
}

function buildIndexPage() {
  return renderPage({
    body: renderToString(<BaseHelmet />),
  });
}
