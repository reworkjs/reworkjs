// @flow

import WorkboxPlugin from 'workbox-webpack-plugin';
import { resolveFrameworkSource } from '../../util/resolve-util';
import BaseFeature from '../BaseFeature';
import type WebpackConfigBuilder from '../WebpackConfigBuilder';

export default class ServiceWorkerFeature extends BaseFeature {

  loadAfter() {
    return '*';
  }

  getFeatureName() {
    return 'service-worker';
  }

  getDescription() {
    return 'Enable service worker';
  }

  isDefaultEnabled() {
    return true;
  }

  visit(config: WebpackConfigBuilder) {

    if (this.isServer()) {
      return;
    }

    config.injectPlugins([
      new WorkboxPlugin.InjectManifest({
        // bit of a hack:
        // we don't actually use the Manifest in watch mode as the caching is broken,
        // but we still want to load the rest of the Service Worker.
        // this excludes everything from the manifest to optimise the development a bit
        ...(this.isDev() && { exclude: [/.*/] }),

        swSrc: resolveFrameworkSource('client/service-worker/index.js', { esModules: true }),
        compileSrc: true,
        swDest: 'sw.js',
      }),
    ]);
  }
}
