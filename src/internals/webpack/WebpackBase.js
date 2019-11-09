// @flow

import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractCssPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import { chalkNok, chalkOk } from '../../shared/chalk';
import frameworkConfig from '../../shared/framework-config';
import projectMetadata from '../../shared/project-metadata';
import frameworkMetadata from '../../shared/framework-metadata';
import { resolveFrameworkSource } from '../util/resolve-util';
import argv from '../rjs-argv';
import appArgv from '../../framework/common/app-argv/node';
import logger from '../../shared/logger';
import getWebpackSettings from '../../shared/webpack-settings';
import BaseHelmet from '../../framework/app/BaseHelmet';
import renderPage from '../../framework/server/setup-http-server/render-page';
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
    const requestedFeatures = parseFeatures(argv.features);

    const features = featureClasses.map(FeatureClass => new FeatureClass(this.isServer(), process.env.NODE_ENV));
    sortDependencies(features);

    for (const feature of features) {
      this.injectFeature(feature, requestedFeatures);
    }
  }

  /** @private */
  injectFeature(feature: BaseFeature, requestedFeatures: { [string]: boolean }) {

    const name = feature.getFeatureName();
    const enabled = requestedFeatures[name] != null ? requestedFeatures[name] : feature.isDefaultEnabled();

    logger.debug(`${enabled ? chalkOk('✓') : chalkNok('✘')} Feature ${name}`);

    if (!enabled) {
      return false;
    }

    feature.visit(this.webpackConfigBuilder);

    return true;
  }

  buildConfig() {
    const EXTENSIONS = wcbUtils.getFileTypeExtensions(
      this.webpackConfigBuilder,
      WebpackConfigBuilder.FILE_TYPE_JS,
    ).map(ext => `.${ext}`);

    const config: Object = {
      cache: true,
      name: this.isServer() ? 'Server' : 'Client',
      entry: this.getEntry(),
      output: this.getOutput(),
      module: {
        rules: this.buildRules(),
      },
      plugins: this.getPlugins(),

      // Allow error boundaries to display errors in non-main chunks
      // https://reactjs.org/docs/cross-origin-errors.html
      devtool: 'cheap-module-source-map',
      performance: {
        hints: false,
      },
      target: this.isServer() ? 'node' : 'web',
      node: {
        // don't transform __dirname when running inside Node.
        __dirname: !this.isServer(),
      },
      resolve: {
        modules: ['node_modules'],
        extensions: [
          // add .server.js and .browser.js extensions which will have priority over default extension if present
          ...(this.isServer()
            ? EXTENSIONS.map(ext => `.server${ext}`)
            : EXTENSIONS.map(ext => `.browser${ext}`)
          ),
          ...EXTENSIONS,
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
      mode: this.isDev ? 'development' : 'production',
      optimization: {
        noEmitOnErrors: true,
        minimize: false,
        removeAvailableModules: false,
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
            // framework must be processed by webpack as it relies on some webpack processes
            new RegExp(`^${frameworkMetadata.name}`),
            // TODO: should we mark all plugins as non-externals?
            /^@reworkjs\/redux/,
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
        ? resolveFrameworkSource('server/index', { esModules: !this.isServer() })
        : resolveFrameworkSource('client/index', { esModules: !this.isServer() }),
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

    if (this.isDev && !this.isServer()) {
      // Allow error boundaries to display errors in non-main chunks
      // https://reactjs.org/docs/cross-origin-errors.html
      output.crossOriginLoading = 'anonymous';
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

    return [{
      test: /\.(eot|ttf|woff|woff2)(\?.*$|$)/i,
      loader: 'file-loader',
    }, {
      test: wcbUtils.getFileTypeRegExp(this.webpackConfigBuilder, WebpackConfigBuilder.FILE_TYPE_IMG),
      use: 'file-loader',
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

  getCssLoader(options: Object = {}) {
    const loaderOptions: Object = {
      importLoaders: options.importLoaders || 0,
    };

    if (isDev) {
      Object.assign(loaderOptions, {
        sourceMap: true,
      });
    }

    if (options.modules) {
      Object.assign(loaderOptions, {
        modules: true,
        localsConvention: 'camelCase',
      });

      if (isDev) {
        Object.assign(loaderOptions, {
          modules: {
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
          },
        });
      }

      // in prod with pre-rendering, we don't generate the CSS. Only the mapping "css class" => "css module class"
      // the actual CSS is served directly from the client bundle.
      if (this.isServer() && !this.isDev) {
        Object.assign(loaderOptions, {
          onlyLocals: true,
        });
      }
    }

    return {
      loader: 'css-loader',
      options: loaderOptions,
    };
  }

  /** @private */
  buildCssLoaders() {
    const pluggedCssLoaders = wcbUtils.getCssLoaders(this.webpackConfigBuilder);

    const cssLoaders = [{
      test: wcbUtils.getFileTypeRegExp(this.webpackConfigBuilder, WebpackConfigBuilder.FILE_TYPE_CSS),
      exclude: /node_modules/,
      use: [
        this.getCssLoader({
          modules: true,
          importLoaders: pluggedCssLoaders.length,
        }),
        ...pluggedCssLoaders,
      ],
    }, {
      test: /\.css$/i,
      include: /node_modules/,
      use: [this.getCssLoader({ modules: false })],
    }];

    const styleLoader = (() => {
      // in prod, extract CSS to separate .css files.
      // Note: The server ignores the file because it simply sends the ones built for the Client
      //       that match used bundle names.
      if (this.isDev) {
        // in dev, use <style> tags
        return this.isServer() ? 'node-style-loader' : 'style-loader';
      }

      // in prod, extract CSS to separate .css files
      // on the server, don't generate the CSS -- load client version
      return this.isServer() ? null : ExtractCssPlugin.loader;
    })();

    if (styleLoader != null) {
      for (const cssLoader of cssLoaders) {
        cssLoader.use = [styleLoader, ...cssLoader.use];
      }
    }

    return cssLoaders;
  }

  /** @private */
  getAliases() {
    const frameworkAliases = {

      // Framework configuration directories
      '@@pre-init': frameworkConfig['pre-init'] || resolveFrameworkSource('dummy/empty-function.js', { esModules: !this.isServer() }),
      '@@render-html': frameworkConfig['render-html'] || resolveFrameworkSource('server/setup-http-server/default-render-page.js', { esModules: !this.isServer() }),
      '@@directories.translations': frameworkConfig.directories.translations,

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    };

    // if (this.isServer()) {
    //   // TODO:
    //   // force babel-runtime to load as commonjs on server because
    //   // node cannot load esm itself (babel-runtime is external)
    //   // --> If this doesn't work, exclude @babel/runtime/helpers/esm from externals
    //   frameworkAliases['@babel/runtime/helpers/esm'] = '@babel/runtime/helpers';
    // }

    const customAliases = wcbUtils.getAliases(this.webpackConfigBuilder);
    Object.assign(frameworkAliases, customAliases);

    return frameworkAliases;
  }

  /** @private */
  getDefinedVars() {
    const NODE_ENV = JSON.stringify(process.env.NODE_ENV);
    const SIDE = JSON.stringify(this.isServer() ? 'server' : 'client');

    const definedVariables: Object = {
      process: {
        env: {
          SIDE,
          NODE_ENV,
          PROCESS_NAME: JSON.stringify(`${projectMetadata.name} (${this.isServer() ? 'server' : 'client'})`),
        },
      },

      // TODO: replace with val-loader
      $$RJS_VARS$$: {
        FRAMEWORK_METADATA: JSON.stringify(frameworkMetadata),
        PROJECT_METADATA: JSON.stringify(projectMetadata),
        PARSED_ARGV: JSON.stringify(appArgv),
      },
    };

    if (this.isServer()) {
      const outputDirectory = getWebpackSettings(this.isServer()).output.path;

      // we only pass build & logs to bundled code
      // as they are the only folders that NEED to exist for the
      // app to run.
      // Using anything else MUST be an error.

      // We don't give any information to the client bundle as they cannot interact
      // with the filesystem at all and trying to MUST be an error too.

      // We give the path relative to the output directory so the project can be
      // moved around freely after being built. This can happen when updating a live app: The app will be built
      // in a temporary folder then moved to its final destination.

      // The path relative path will be transformed into an absolute path at runtime.

      // all executed JS files will be located at the root of outputDirectory, so we the new absolute path
      // will be the correct one no matter which bundle produces it.
      const FRAMEWORK_CONFIG = {
        directories: {
          logs: path.relative(outputDirectory, frameworkConfig.directories.logs),
          build: path.relative(outputDirectory, frameworkConfig.directories.build),
        },
      };

      // TODO: replace with val-loader (or remove)
      definedVariables.$$RJS_VARS$$.FRAMEWORK_CONFIG = JSON.stringify(FRAMEWORK_CONFIG);
    }

    return flattenKeys(definedVariables);
  }

  /** @private */
  getPlugins() {
    // TODO inject DLLs <script data-dll='true' src='/${dllName}.dll.js'></script>`
    // TODO https://github.com/diurnalist/chunk-manifest-webpack-plugin
    const plugins = [
      // remove outdated assets from previous builds.
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin(this.getDefinedVars()),
      new CopyWebpackPlugin([{
        from: frameworkConfig.directories.resources,
        to: './',
        toType: 'dir',
      }]),

      // Inject webpack bundle into HTML.
      new HtmlWebpackPlugin({
        inject: true,
        templateContent: buildIndexPage(),

        // FIXME temporary hack for webpack 4 https://github.com/jantimon/html-webpack-plugin/issues/870
        chunksSortMode: 'none',
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
      new LoadablePlugin({
        writeToDisk: true,
      }),
    ];

    // if (!this.isServer()) {
    //   plugins.push(
    //     new PolyfillInjectorPlugin({
    //       polyfills: ['Promise'],
    //     }),
    //   );
    // }

    if (this.isDev) {
      plugins.push(
        // enable hot reloading.
        new webpack.HotModuleReplacementPlugin(),

        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
      );
    }

    if (!this.isDev && !this.isServer()) {
      // Extract the CSS into a seperate file (only prod, and plugin is not compatible with SSR).
      plugins.push(
        new ExtractCssPlugin({
          filename: '[name].[contenthash].css',
        }),
      );
    }

    return plugins.concat(...wcbUtils.getPlugins(this.webpackConfigBuilder));
  }
}

function buildIndexPage() {
  const body = renderToString(<BaseHelmet />);

  return renderPage({
    body,
    helmet: Helmet.renderStatic(),
  });
}

function flattenKeys(obj, out = {}, paths = []) {

  for (const key of Object.getOwnPropertyNames(obj)) {
    paths.push(key);

    if (typeof obj[key] === 'object') {
      flattenKeys(obj[key], out, paths);
    } else {
      out[paths.join('.')] = obj[key];
    }

    paths.pop();
  }

  return out;
}
