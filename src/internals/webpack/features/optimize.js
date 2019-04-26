// @flow

import GzipPlugin from 'compression-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

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
    return this.isProd();
  }

  visit(config: WebpackConfigBuilder) {
    config.injectRawConfig({
      devtool: 'source-map',
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

        // Enabling WebP causes imagemin to convert every image to WebP,
        // making them unusable on non chrome browsers
        // TODO enable once
        // https://github.com/tcoopman/image-webpack-loader/issues/112
        // https://github.com/tcoopman/image-webpack-loader/issues/111
        // is fixed
        // webp: {
        //   quality: 75,
        //
        //   // TODO add a way to define the type of image for "preset"
        //   // default, photo, picture, drawing, icon and text.
        //   // https://github.com/imagemin/imagemin-webp
        //   method: 5,
        // },
      },
    });

    if (this.isServer()) {
      return;
    }

    config.injectRawConfig({
      performance: {
        hints: 'warning',
      },
      optimization: {
        removeAvailableModules: false,
        splitChunks: {
          // don't generate names for long term caching
          // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
          name: false,
        },
        minimize: true,
        minimizer: [

          new TerserPlugin({
            parallel: true,
            cache: true,

            // preserve LICENSE comments (*!, /**!, @preserve or @license) for legal stuff but extract them
            // to their own file to reduce bundle size.
            extractComments: true,
            sourceMap: true,

            terserOptions: {
              compress: {
                warnings: false,

                // TODO set to 6/7/8 if .browserlistrc supports it
                // Will use newer features to optimize
                ecma: 5,
              },

              output: {
                // TODO set to 6/7/8 if .browserlistrc supports it
                // Will use newer features to optimize
                ecma: 5,
              },

              // TODO this should be based on .browserlistrc
              safari10: true,

              ie8: false,
            },
          }),
        ],
      },
    });

    config.injectPlugins([

      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 0,
        minRatio: 0.8,
        quality: 11,
      }),

      new GzipPlugin([{
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 0,
        minRatio: 0.8,
      }]),
    ]);
  }
}
