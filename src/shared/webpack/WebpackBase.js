import fs from 'fs';
import { resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import cheerio from 'cheerio';
import findCacheDir from 'find-cache-dir';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import frameworkConfig from '../../shared/framework-config';
import logger from '../../shared/logger';
import projectMetadata from '../../shared/project-metadata';
import frameworkMetadata from '../../shared/framework-metadata';
import frameworkBabelRc from '../../shared/framework-babelrc';
import { resolveRoot, resolveFrameworkSource } from '../../shared/resolve';
import { isDev, isTest } from '../EnvUtil';
import selectWebpackModulePlugin from './selectWebpackModulePlugin';

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
  cssLoaders: { test: string, loaders: string[] }[] = [];

  constructor(side: number) {
    this.isDev = isDev;
    this.isTest = isTest;
    this.side = side;

    this.addCssLoader('(sc|sa|c)ss', [
      this.cssLoaderModule,
      'postcss-loader',
      'sass-loader',
    ]);
  }

  get cssLoaderModule() {
    const cssOptions = 'css-loader?modules&importLoaders=1&camelCase';
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
          'jsnext:module',
          'module',
          'jsnext:main',
          'main',
        ],
        alias: this.getAliases(),
      },
    };

    if (this.isServer()) {
      // exclude any absolute module (npm/node) from the build, except this module.
      // this module must be included otherwise the server build will have two
      // separate versions of the framework loaded.
      const anyAbsoluteExceptFramework = new RegExp(`^(?!${frameworkMetadata.name}(\\/.+)?$)[a-z\\-0-9]+(\\/.+)?$`);

      config.externals = [
        anyAbsoluteExceptFramework,
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

    // node_modules\/(?!reworkjs)

    const anyNodeModuleExceptFramework = new RegExp(`node_modules\\/(?!${frameworkMetadata.name})`);

    const loaders = [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: anyNodeModuleExceptFramework,
      query: replaceBabelPreset(this.getBabelConfig()),
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)(\?.*$|$)/,
      loader: 'file-loader',
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
        `image-webpack?{
          progressive: true,
          optimizationLevel: 7,
          interlaced: false,
          pngquant: {
            quality: "65-90",
            speed: 4
          }
        }`,
      ],
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    }].concat(this.buildCssLoaders());

    if (this.isDev) {
      loaders.push({
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader?{rules:{"no-console":1, "no-debugger":1}}',
        enforce: 'pre',
      });
    }

    return loaders;
  }

  buildCssLoaders() {
    const loaders = [];

    for (const cssLoader of this.cssLoaders) {
      const loader = {};
      loader.test = cssLoader.test;

      if (this.isDev) {
        loader.loaders = ['isomorphic-style-loader', ...cssLoader.loaders];
      } else {
        loader.loader = ExtractTextPlugin.extract({
          fallbackLoader: 'isomorphic-style-loader',
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
        ? resolveFrameworkSource('server/index')
        : resolveFrameworkSource('client/index'),
    ];

    // front-end dev libs.
    if (this.isDev && !this.isServer()) {
      entry.unshift(
        // Necessary for hot reloading with IE
        'eventsource-polyfill',
        'webpack-hot-middleware/client',
        resolveRoot('lib/internals/dev-preamble.js'),
      );
    }

    return entry;
  }

  getPublicPath() {
    return '/';
  }

  getOutput() {
    // Output to build directory.
    const output = {
      path: `${frameworkConfig.directories.build}/webpack-${this.isServer() ? 'server' : 'client'}`,
      publicPath: this.getPublicPath(),
    };

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
    return this.isDev ? 'cheap-module-eval-source-map' : 'cheap-source-map';
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
    const definePluginArg = {
      'process.env.BUILD_ENV': JSON.stringify(process.env.NODE_ENV), // eslint-disable-line no-process-env
      webpack_globals: {
        PROCESS_NAME: JSON.stringify(`${projectMetadata.name} (${this.isServer() ? 'server' : 'client'})`),
        SIDE: JSON.stringify(this.isServer() ? 'server' : 'client'),
        PROJECT_DIR: JSON.stringify(process.cwd()),
        ROOT_DIR: JSON.stringify(resolve(__dirname, '../../..')),
      },
      frameworkConfig: JSON.stringify(frameworkConfig),
      frameworkBabelrc: JSON.stringify(frameworkBabelRc),
      projectMetadata: JSON.stringify(projectMetadata),
      frameworkMetadata: JSON.stringify(frameworkMetadata),
    };

    if (!this.isServer()) {
      definePluginArg['process.env'] = {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV), // eslint-disable-line no-process-env
      };
    }

    const plugins = [
      new CopyWebpackPlugin([{
        from: { glob: `${frameworkConfig.directories.resources}/**/**/*` },
        to: './',
        toType: 'dir',
      }]),

      new webpack.DefinePlugin(definePluginArg),

      selectWebpackModulePlugin(),
    ];

    // TODO inject DLLs <script data-dll='true' src='/${dllName}.dll.js'></script>`
    // TODO https://github.com/diurnalist/chunk-manifest-webpack-plugin

    if (this.isDev) {
      plugins.push(
        // enable hot reloading.
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),

        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),

        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebookincubator/create-react-app/issues/186
        // new WatchMissingNodeModulesPlugin(paths.appNodeModules), // TODO

        // Inject webpack bundle into HTML.
        new HtmlWebpackPlugin({
          inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
          templateContent: templateContent(),
        }),
      );
    } else {
      if (!this.isServer()) {
        // there is no need to optimise bundle sizes on the server
        plugins.push(
          new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            children: true,
            minChunks: 2,
            async: true,
          }),

          new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
              warnings: false, // ...but do not show warnings in the console (there is a lot of them)
            },
          }),

          // OccurrenceOrderPlugin is needed for long-term caching to work properly.
          // See http://mxs.is/googmv
          new webpack.optimize.OccurrenceOrderPlugin(true),
        );
      }

      plugins.push(
        new WebpackCleanupPlugin({ quiet: true }),

        new HtmlWebpackPlugin({
          inject: true,
          templateContent: templateContent(),
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
        }),

        // Extract the CSS into a seperate file
        new ExtractTextPlugin('[name].[contenthash].css'),

        // Put it in the end to capture all the HtmlWebpackPlugin's
        // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
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
    // It enables caching results in ./node_modules/.cache/react-scripts/
    // directory for faster rebuilds. We use findCacheDir() because of:
    // https://github.com/facebookincubator/create-react-app/issues/483
    config.cacheDirectory = findCacheDir({
      name: frameworkMetadata.name,
    });

    return config;
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
