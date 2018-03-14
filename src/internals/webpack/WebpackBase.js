// @flow

import minimist from 'minimist';
import React from 'react';
import chalk from 'chalk';
import { renderToString } from 'react-dom/server';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import nodeExternals from 'webpack-node-externals';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import PolyfillInjectorPlugin from 'webpack-polyfill-injector';
import frameworkConfig from '../../shared/framework-config';
import projectMetadata from '../../shared/project-metadata';
import frameworkMetadata from '../../shared/framework-metadata';
import { resolveFrameworkSource } from '../util/resolve-util';
import argv from '../rjs-argv';
import logger from '../../shared/logger';
import getWebpackSettings from '../../shared/webpack-settings';
import BaseHelmet from '../../framework/app/BaseHelmet';
import renderPage from '../../framework/server/setup-http-server/render-page';
import RjsDumpStatsPlugin from './DumpEntryPointsPlugin';
import RequireEnsureHookPlugin from './RequireEnsureHookPlugin';
import BaseFeature from './BaseFeature';
import WebpackConfigBuilder, * as wcbUtils from './WebpackConfigBuilder';
import sortDependencies from './sort-dependencies';
import featureClasses from './features';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

function parseFeatures(str) {
  if (!str) {
    return {};
  }

  const features = {};

  str.split(',').forEach(featureName => {
    if (featureName.charAt(0) === '-') {
      features[featureName.substr(1)] = false;
    } else {
      features[featureName] = true;
    }
  });

  return features;
}

export default class WebpackBase {

  static SIDE_SERVER = 0;
  static SIDE_CLIENT = 1;

  /** @private */
  isDev: boolean;

  /** @private */
  isTest: boolean;

  /** @private */
  side: number;

  constructor(side: number) {
    this.isDev = isDev;
    this.isTest = isTest;
    this.side = side;

    this.webpackConfigBuilder = new WebpackConfigBuilder();

    this.injectFeatures();
  }

  /** @private */
  isServer() {
    return this.side === WebpackBase.SIDE_SERVER;
  }

  injectFeatures() {
    logger.debug('Injecting webpack Features.');
    const enabledFeatures = parseFeatures(argv.features);

    const features = featureClasses.map(FeatureClass => new FeatureClass(this.isServer(), process.env.NODE_ENV));
    sortDependencies(features);

    for (const feature of features) {
      this.injectFeature(feature, enabledFeatures);
    }
  }

  /** @private */
  injectFeature(feature: BaseFeature, enabledFeatures) {

    const name = feature.getFeatureName();
    const enabled = feature.isEnabled(enabledFeatures[name]);

    logger.debug(`${enabled ? chalk.green('✓') : chalk.red('✘')} Feature ${name}`);

    if (!enabled) {
      return false;
    }

    feature.visit(this.webpackConfigBuilder);

    return true;
  }

  buildConfig() {
    const config = {
      cache: true,
      name: this.isServer() ? 'Server' : 'Client',
      entry: this.getEntry(),
      output: this.getOutput(),
      module: {
        rules: this.buildRules(),
      },
      plugins: this.getPlugins(),
      devtool: 'cheap-module-eval-source-map',
      performance: {
        hints: false,
      },
      target: this.isServer() ? 'node' : 'web',
      resolve: {
        modules: ['node_modules'],
        extensions: [
          '.mjs',
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
    };

    if (this.isServer()) {
      // exclude any absolute module (npm/node) from the build, except this module.
      // this module must be included otherwise the server build will have two
      // separate versions of the framework loaded.
      // const anyAbsoluteExceptFrameworkAndCss = new RegExp(`^(?!${}(\\/.+)?$)[a-z\\-_0-9]+(?!.+\\.css$).+$`);

      config.externals = [
        nodeExternals({
          whitelist: [
            new RegExp(`^${frameworkMetadata.name}`),
            /\.css$/i,
          ],
        }),
      ];
    } else {
      config.resolve.mainFields.unshift('web');
      config.resolve.mainFields.unshift('jsnext:web');
      config.resolve.mainFields.unshift('browser');
      config.resolve.mainFields.unshift('jsnext:browser');
    }

    return wcbUtils.mergeRaw(this.webpackConfigBuilder, config);
  }

  /** @private */
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

  /** @private */
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

  /** @private */
  buildRules() {

    // TODO consider using url-loader rather than file-loader maybe ?
    // Need to test perf gain.

    return [{
      test: /\.(eot|ttf|woff|woff2)(\?.*$|$)/i,
      loader: 'file-loader',
    }, {
      test: wcbUtils.getFileTypeRegExp(this.webpackConfigBuilder, WebpackConfigBuilder.FILE_TYPE_IMG),
      use: [
        {
          loader: 'srcset-loader',
          options: {
            lightweight: true,
          },
        },
        'file-loader',
      ],
    }, {
      test: /\.(mp4|webm)/i,
      loader: 'file-loader',
    }, {
      // FIXME temporary fix for webpack 4 https://github.com/webpack-contrib/bundle-loader/issues/74
      test: /\.json$/i,
      type: 'javascript/auto',
      loader: 'json-loader',
    }]
      .concat(this.buildCssLoaders())
      .concat(wcbUtils.buildRules(this.webpackConfigBuilder));
  }

  /** @private */
  buildCssLoaders() {
    const pluggedCssLoaders = wcbUtils.getCssLoaders(this.webpackConfigBuilder);

    const cssLoaders = [{
      test: wcbUtils.getFileTypeRegExp(this.webpackConfigBuilder, WebpackConfigBuilder.FILE_TYPE_CSS),
      exclude: /node_modules/,
      use: [
        getCssLoader({
          modules: true,
          importLoaders: pluggedCssLoaders.length,
        }),
        ...pluggedCssLoaders,
      ],
    }, {
      test: /\.css$/i,
      include: /node_modules/,
      use: [getCssLoader({ modules: false })],
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

  /** @private */
  getAliases() {
    const frameworkAliases = {

      // Framework configuration directories
      '@@pre-init': frameworkConfig['pre-init'],
      '@@main-component': frameworkConfig['entry-react'],
      '@@directories.routes': frameworkConfig.directories.routes,
      '@@directories.translations': frameworkConfig.directories.translations,
      '@@directories.providers': frameworkConfig.directories.providers,

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    };

    const customAliases = wcbUtils.getAliases(this.webpackConfigBuilder);
    Object.assign(frameworkAliases, customAliases);

    return frameworkAliases;
  }

  /** @private */
  getDefinedVars() {
    const NODE_ENV = JSON.stringify(process.env.NODE_ENV);
    const SIDE = JSON.stringify(this.isServer() ? 'server' : 'client');

    const programArgv = minimist(argv['--'] || []);

    const definedVariables = {
      'process.env.SIDE': SIDE,
      'process.env.BUILD_ENV': NODE_ENV,
      'process.env.PROCESS_NAME': JSON.stringify(`${projectMetadata.name} (${this.isServer() ? 'server' : 'client'})`),
      $$RJS_VARS$$: {
        FRAMEWORK_CONFIG: JSON.stringify(frameworkConfig),
        FRAMEWORK_METADATA: JSON.stringify(frameworkMetadata),
        PROJECT_METADATA: JSON.stringify(projectMetadata),
        PARSED_ARGV: JSON.stringify(programArgv),
      },
    };

    if (!this.isServer()) {
      // define process on the browser
      definedVariables.process = {
        env: {
          NODE_ENV,
        },
      };
    }

    return definedVariables;
  }

  /** @private */
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

      // Dump chunk mapping and entryPoints so we can determine which client chunks to send depending on which
      // chunks were imported during server-side rendering
      new RjsDumpStatsPlugin(),
    ];

    if (this.isServer()) {
      plugins.push(

        // Hook import() directives on the server-side so we can know which
        // chunks are loaded for which routes and give them along with the HTTP response.
        new RequireEnsureHookPlugin(),
      );
    }

    if (!this.isServer()) {
      plugins.push(
        new PolyfillInjectorPlugin({
          polyfills: ['Promise'],
          service: true,
        }),
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

    return plugins.concat(...wcbUtils.getPlugins(this.webpackConfigBuilder));
  }
}

function buildIndexPage() {
  return renderPage({
    body: renderToString(<BaseHelmet />),
  });
}

function getCssLoader(options = {}) {
  const loaderOptions = {
    importLoaders: options.importLoaders || 0,
  };

  if (isDev) {
    Object.assign(loaderOptions, {
      sourceMap: true,
    });
  } else {
    // TODO cssnano options
    Object.assign(loaderOptions, {
      minimize: true,
    });
  }

  if (options.modules) {
    Object.assign(loaderOptions, {
      modules: true,
      camelCase: true,
    });

    if (isDev) {
      Object.assign(loaderOptions, {
        localIdentName: '[local]__[hash:base64:5]',
      });
    }
  }

  return {
    loader: 'css-loader',
    options: loaderOptions,
  };
}
