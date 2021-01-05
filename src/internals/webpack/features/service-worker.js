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
        swSrc: resolveFrameworkSource('client/service-worker/index.js', { esModules: true }),
        compileSrc: true,
        swDest: 'service-worker.js',
      }),
    ]);
  }
}
