// @flow

import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import BaseFeature from '../BaseFeature';
import type WebpackConfigBuilder from '../WebpackConfigBuilder';

export default class OptimizeFeature extends BaseFeature {

  loadAfter() {
    return '*';
  }

  getFeatureName() {
    return 'optimize';
  }

  getDescription() {
    return 'Various optimisation designed to reduce the client bundle size';
  }

  isDefaultEnabled() {
    return this.isProd() && !this.isServer();
  }

  visit(config: WebpackConfigBuilder) {
    config.injectRawConfig({
      devtool: 'source-map',
      performance: {
        hints: 'warning',
      },
      optimization: {
        splitChunks: {
          // don't generate names for long term caching
          // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
          name: false,
        },
      },
    });

    if (this.isServer()) {
      return;
    }

    config.injectRawConfig({
      optimization: {
        minimize: true,
        minimizer: [

          new UglifyJsPlugin({
            parallel: true,
            cache: true,

            // preserve LICENSE comments (*!, /**!, @preserve or @license) for legal stuff but extract them
            // to their own file to reduce bundle size.
            extractComments: true,
            sourceMap: true,

            uglifyOptions: {
              compress: {
                warnings: false,
              },

              output: {
                // TODO set to 6/7/8 if .browserlistrc supports it
                // Will use newer features to optimize
                ecma: 5,
              },

              // TODO this should be based on .browserlistrc
              ecma: 5,

              // TODO this should be based on .browserlistrc
              safari10: true,

              ie8: false,
            },
          }),
        ],
      },
    });

    config.injectRules({
      test: BaseFeature.FILE_TYPE_IMG,
      loader: 'image-webpack-loader',
      query: {
        bypassOnDebug: true,
        mozjpeg: {
          progressive: true,
          quality: 80,
        },
        gifsicle: {
          interlaced: false,
          optimizationLevel: 3,
        },
        optipng: {
          optimizationLevel: 7,
        },
        pngquant: {
          quality: '65-90',
          speed: 4,
        },
        svgo: {},
        webp: {
          quality: 75,

          // TODO add a way to define the type of image for "preset"
          // default, photo, picture, drawing, icon and text.
          // https://github.com/imagemin/imagemin-webp
          method: 5,
        },
      },
    });

    config.injectPlugins([

      // TODO brotli
      new CompressionPlugin([{
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|html|svg)$/,
        threshold: 0,
        minRatio: 0.8,
      }]),

      // Put it in the end to capture all the HtmlWebpackPlugin's assets
      new OfflinePlugin({
        relativePaths: false,

        // this is applied before any match in `caches` section
        excludes: [
          '**/*.gz',
          '**/*.map',
          '**/*.LICENSE',
        ],

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
        ServiceWorker: {
          // FIXME remove this once OfflinePlugin 5 releases
          minify: false,
        },
      }),
    ]);
  }
}
