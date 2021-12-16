import WorkboxPlugin from 'workbox-webpack-plugin';
import { resolveFrameworkSource } from '../../util/resolve-util.js';
import BaseFeature from '../BaseFeature.js';
import type WebpackConfigBuilder from '../WebpackConfigBuilder.js';

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

    // Workbox is disabled in dev
    if (this.isDev()) {
      config.addEntry('sw', [
        resolveFrameworkSource('client/service-worker/without-workbox.js'),
      ]);

      return;
    }

    config.injectPlugins([
      new WorkboxPlugin.InjectManifest({
        swSrc: resolveFrameworkSource('client/service-worker/with-workbox.js'),
        compileSrc: true,
        swDest: 'sw.js',
      }),
    ]);
  }
}
