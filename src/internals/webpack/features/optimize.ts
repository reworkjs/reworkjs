import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import BaseFeature from '../BaseFeature.js';
import type WebpackConfigBuilder from '../WebpackConfigBuilder.js';

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
      resourceQuery: { not: [/url/] },
      loader: 'image-webpack-loader',
      options: {
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
          quality: [0.65, 0.9],
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
        removeAvailableModules: true,
        minimize: true,
        minimizer: [
          // minimize CSS
          new CssMinimizerPlugin(),

          // minimize JS
          new TerserPlugin({
            parallel: true,

            // preserve LICENSE comments (*!, /**!, @preserve or @license) for legal stuff but extract them
            // to their own file to reduce bundle size.
            extractComments: true,

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
  }
}
