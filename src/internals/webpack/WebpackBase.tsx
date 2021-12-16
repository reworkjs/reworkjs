import assert from 'assert';
import { createRequire } from 'module';
import path from 'path';
import LoadablePlugin from '@loadable/webpack-plugin';
import frameworkConfig from '@reworkjs/core/_internal_/framework-config';
import frameworkMetadata from '@reworkjs/core/_internal_/framework-metadata';
import logger from '@reworkjs/core/logger';
import projectMetadata from '@reworkjs/core/project-metadata';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import minifiedCssIdents from 'mini-css-class-name/css-loader/index.js';
import ExtractCssPlugin from 'mini-css-extract-plugin';
import { renderToString } from 'react-dom/server.js';
import type { FilledContext } from 'react-helmet-async';
import { HelmetProvider } from 'react-helmet-async';
import ResolveTypescriptPlugin from 'resolve-typescript-plugin';
import type { Configuration } from 'webpack';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import SriPlugin from 'webpack-subresource-integrity';
import WebpackBar from 'webpackbar';
import BaseHelmet from '../../framework/common/BaseHelmet.js';
import appArgv from '../../framework/common/app-argv/node.js';
import renderPage from '../../framework/server/setup-http-server/render-page.js';
import { chalkNok, chalkOk } from '../../shared/chalk.js';
import getWebpackSettings from '../../shared/webpack-settings.js';
import argv from '../rjs-argv.js';
import { resolveFrameworkSource } from '../util/resolve-util.js';
import type BaseFeature from './BaseFeature.js';
import WebpackConfigBuilder, * as wcbUtils from './WebpackConfigBuilder.js';
import featureClasses from './features.js';
import sortDependencies from './sort-dependencies.js';

// TODO: remove once import.meta.resolve is ready
const require = createRequire(import.meta.url);

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

function parseFeatures(str: string): { [key: string]: boolean } {
  if (!str) {
    return {};
  }

  const features: { [key: string]: boolean } = {};

  for (const featureName of str.split(',')) {
    if (featureName.startsWith('-')) {
      features[featureName.substring(1)] = false;
    } else {
      features[featureName] = true;
    }
  }

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

  #webpackConfigBuilder: WebpackConfigBuilder;

  constructor(side: number) {
    this.isDev = isDev;
    this.isTest = isTest;
    this.side = side;

    this.#webpackConfigBuilder = new WebpackConfigBuilder();

    this.#injectFeatures();
  }

  isServer() {
    return this.side === WebpackBase.SIDE_SERVER;
  }

  #injectFeatures() {
    logger.debug('Injecting webpack Features.');
    const requestedFeatures = parseFeatures(argv.features);

    const features = featureClasses.map(FeatureClass => new FeatureClass(this.isServer(), process.env.NODE_ENV));
    sortDependencies(features);

    for (const feature of features) {
      this.#injectFeature(feature, requestedFeatures);
    }
  }

  #injectFeature(feature: BaseFeature, requestedFeatures: { [key: string]: boolean }) {

    const name = feature.getFeatureName();
    const enabled = requestedFeatures[name] != null ? requestedFeatures[name] : feature.isDefaultEnabled();

    logger.debug(`${enabled ? chalkOk('✓') : chalkNok('✘')} Feature ${name}`);

    if (!enabled) {
      return false;
    }

    feature.visit(this.#webpackConfigBuilder);

    return true;
  }

  buildConfig() {
    const EXTENSIONS = wcbUtils.getFileTypeExtensions(
      this.#webpackConfigBuilder,
      WebpackConfigBuilder.FILE_TYPE_JS,
    ).map(ext => `.${ext}`);

    const config: Configuration = {
      cache: true,
      name: this.isServer() ? 'Server' : 'Client',
      entry: {
        ...this.#webpackConfigBuilder.getEntries(),
        main: this.#getMainEntry(),
      },
      output: this.#getOutput(),
      module: {
        rules: this.#buildRules(),
      },
      plugins: this.#getPlugins(),

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
      infrastructureLogging: {
        level: this.isDev ? 'warn' : 'info',
      },
      stats: this.isDev ? 'errors-warnings' : 'normal',
      ignoreWarnings: [{
        message: /InjectManifest has been called multiple times/,
      }],
      resolve: {
        modules: ['node_modules'],
        extensions: EXTENSIONS,
        mainFields: [
          // when loaded by webpack for the browser
          ...(this.isServer() ? ['server:main'] : ['browser:main']),
          // when loaded by webpack (node or browser)
          'webpack:main',
          'jsnext:module',
          'module',
          'jsnext:main',
          'main',
        ],
        alias: this.#getAliases(),
        // they fucked up their package
        // @ts-expect-error
        plugins: [new ResolveTypescriptPlugin.default()],
      },
      mode: this.isDev ? 'development' : 'production',
      experiments: {
        topLevelAwait: true,
      },
      optimization: {
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
          allowlist: [
            // framework must be processed by webpack as it relies on some webpack processes
            new RegExp(`^${frameworkMetadata.name}`),
            // TODO: should we mark all plugins as non-externals?
            /^@reworkjs\/redux/,
            /\.css$/i,
          ],
        }),
      ];
    } else {

      config.resolve!.mainFields!.unshift('web');
      config.resolve!.mainFields!.unshift('jsnext:web');
      config.resolve!.mainFields!.unshift('browser');
      config.resolve!.mainFields!.unshift('jsnext:browser');
    }

    return wcbUtils.mergeRaw(this.#webpackConfigBuilder, config);
  }

  #getMainEntry() {
    // front-end entry point.
    const mainEntry = [
      this.isServer()
        ? resolveFrameworkSource('server/index')
        : resolveFrameworkSource('client/index'),
    ];

    // front-end dev libs.
    if (this.isDev && !this.isServer()) {
      mainEntry.unshift(
        // Necessary for hot reloading with IE
        'eventsource-polyfill',
        'webpack-hot-middleware/client',
        require.resolve('./dev-preamble'),
      );
    } else if (this.isDev && this.isServer()) {
      mainEntry.unshift(
        // hot reload if parent sends signal SIGUSR2
        require.resolve('./hmr-server'),
      );
    }

    return mainEntry;
  }

  #getOutput(): Configuration['output'] {
    // Output to build directory.
    const output: Configuration['output'] = getWebpackSettings(this.isServer()).output;

    // This allow error boundaries to display errors in non-main chunks
    // https://reactjs.org/docs/cross-origin-errors.html
    // It's also necessary for subresource-integrity
    output.crossOriginLoading = 'anonymous';

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

  #buildRules() {

    const resources = [
      /\.(eot|ttf|woff|woff2)(\?.*$|$)/i,
      /\.(mp4|webm|md)/i,
      wcbUtils.getFileTypeRegExp(this.#webpackConfigBuilder, WebpackConfigBuilder.FILE_TYPE_IMG),
    ];

    return [
      ...resources.map(resourceRegex => {
        return {
          oneOf: [
            // adding ?raw will include the source as string
            { type: 'asset/source', resourceQuery: /raw/ },
            { type: 'asset/resource', resourceQuery: /url/ },
            { type: 'asset/resource', test: resourceRegex },
          ],
        };
      }),
      {
        // FIXME temporary fix for webpack 4 https://github.com/webpack-contrib/bundle-loader/issues/74
        test: /\.json$/i,
        type: 'javascript/auto',
        loader: 'json-loader',
      },
    ]
      .concat(this.#buildCssLoaders())
      .concat(wcbUtils.buildRules(this.#webpackConfigBuilder));
  }

  #getCssLoader(options: Object = {}) {
    const loaderOptions: Object = {
      importLoaders: options.importLoaders || 0,
      // sourceMap: depends on webpack's `devtool` config
      // module.auto is true by default
    };

    if (options.modules) {
      Object.assign(loaderOptions, {
        modules: {
          exportLocalsConvention: 'camelCase',
        },
      });

      if (isDev) {
        loaderOptions.modules.getLocalIdent = buildLocalIdentGenerator();
      } else {
        loaderOptions.modules.getLocalIdent = minifiedCssIdents();
      }

      // in prod with pre-rendering, we don't generate the CSS. Only the mapping "css class" => "css module class"
      // the actual CSS is served directly from the client bundle.
      if (this.isServer() && !this.isDev) {
        loaderOptions.modules.exportOnlyLocals = true;
      }
    }

    return {
      loader: 'css-loader',
      options: loaderOptions,
    };
  }

  #buildCssLoaders() {
    const pluggedCssLoaders = wcbUtils.getCssLoaders(this.#webpackConfigBuilder);

    const cssLoaders = [{
      test: wcbUtils.getFileTypeRegExp(this.#webpackConfigBuilder, WebpackConfigBuilder.FILE_TYPE_CSS),
      exclude: /node_modules/,
      use: [
        this.#getCssLoader({
          modules: true,
          importLoaders: pluggedCssLoaders.length,
        }),
        ...pluggedCssLoaders,
      ],
    }, {
      test: /\.css$/i,
      include: /node_modules/,
      use: [this.#getCssLoader({ modules: false })],
    }];

    const styleLoader = (() => {
      // server ignores built css, it sends the one built by the client
      if (this.isServer()) {
        return null;
      }

      return {
        // mini-css-extract-plugin is *very* slow and a no-go for watch mode
        loader: this.isDev ? 'style-loader' : ExtractCssPlugin.loader,
      };
    })();

    if (styleLoader != null) {
      for (const cssLoader of cssLoaders) {
        cssLoader.use = [styleLoader, ...cssLoader.use];
      }
    }

    return cssLoaders;
  }

  #getAliases() {
    const frameworkAliases = {

      // Framework configuration directories
      '@@pre-init': frameworkConfig['pre-init'] || resolveFrameworkSource('dummy/empty-function.js'),
      '@@render-html': frameworkConfig['render-html'] || resolveFrameworkSource('server/setup-http-server/default-render-page.js'),
      '@@directories.translations': frameworkConfig.directories.translations,

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      'react-helmet': resolveFrameworkSource('dummy/react-helmet.js'),
    };

    // if (this.isServer()) {
    //   // TODO:
    //   // force babel-runtime to load as commonjs on server because
    //   // node cannot load esm itself (babel-runtime is external)
    //   // --> If this doesn't work, exclude @babel/runtime/helpers/esm from externals
    //   frameworkAliases['@babel/runtime/helpers/esm'] = '@babel/runtime/helpers';
    // }

    const customAliases = wcbUtils.getAliases(this.#webpackConfigBuilder);
    Object.assign(frameworkAliases, customAliases);

    return frameworkAliases;
  }

  #getDefinedVars() {
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

  #getPlugins() {
    // TODO inject DLLs <script data-dll='true' src='/${dllName}.dll.js'></script>`
    // TODO https://github.com/diurnalist/chunk-manifest-webpack-plugin
    const plugins = [
      new WebpackBar(),
      // remove outdated assets from previous builds.
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin(this.#getDefinedVars()),
      new CopyWebpackPlugin({
        patterns: [{
          noErrorOnMissing: true,
          from: frameworkConfig.directories.resources,
          to: './',
          toType: 'dir',
          globOptions: {
            dot: true,
          },
        }],
      }),

      // subresource-integrity
      new SriPlugin({
        hashFuncNames: ['sha384'],
        // FIXME SRI disabled due to it outputting the wrong values
        enabled: false, // frameworkConfig['emit-integrity'] && !this.isDev,
      }),

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
        // react-refresh is disabled because of how incredibly slow it is since webpack 5
        // import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
        // new ReactRefreshPlugin(),

        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
      );
    }

    if (!this.isServer() && !this.isDev) {
      // Extract the CSS into a separate file.
      plugins.push(
        new ExtractCssPlugin({
          filename: this.isDev ? '[name].css' : '[name].[contenthash].css',
          chunkFilename: this.isDev ? '[id].css' : '[id].[contenthash].css',

          // in order to generate the CSS files properly, import order must
          // be the same across the project. It is very hard / impossible to
          // do that by hand currently. Until an automated solution arrives,
          // this warning is useless.
          ignoreOrder: this.isDev,
        }),
      );
    }

    return plugins.concat(...wcbUtils.getPlugins(this.#webpackConfigBuilder));
  }
}

function buildIndexPage() {
  const helmetContext: Partial<FilledContext> = {};

  const body = renderToString(
    <HelmetProvider context={helmetContext}>
      <BaseHelmet />
    </HelmetProvider>,
  );

  assert(helmetContext.helmet != null);

  return renderPage({
    body,
    helmet: helmetContext.helmet,
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

/**
 *
 * @returns {function(*, *, *)}
 */
function buildLocalIdentGenerator() {
  const prefixMap = new Map();
  const existingPrefixes = new Set();

  // alternative solution for prefix gen: take file path and remove common junk (src, style, etc...)
  //  eg. src/components/Button/style.module.scss -> components-Button
  // ignore fileName if it is the same as its parent folder
  //  eg. src/views/home/home.module.scss -> views-home (not views-home-home)
  // remove extension from fileNames
  //  eg. src/global.module.scss -> global
  // but keep fileName if there is no folder, even if junk
  //  eg. src/styles.scss -> styles

  // const junkPrefixes = new Set(['src', 'lib', 'app', 'component', 'components']);
  // const junkFileNames = new Set(['styles', 'style', 'css', 'index']); // fileNames ignore everything after first dot

  function getPrefix(filePath: string) {
    if (!prefixMap.has(filePath)) {
      const folderMatch = filePath.match(/\/([^/]+)\/[^/]+$/);
      const prefixBase = folderMatch[1];
      let uniquePrefix = prefixBase;

      let i = 1;
      while (existingPrefixes.has(uniquePrefix)) {
        uniquePrefix = prefixBase + i;
        i++;
      }

      existingPrefixes.add(uniquePrefix);
      prefixMap.set(filePath, uniquePrefix);
    }

    return prefixMap.get(filePath);
  }

  return (context, _, localName) => {
    const prefix = getPrefix(context.resourcePath);

    return `${prefix}__${localName}`;
  };
}
