// @flow

import OfflinePlugin from 'offline-plugin';
import BaseFeature from '../BaseFeature';
import type WebpackConfigBuilder from '../WebpackConfigBuilder';
import frameworkConfig from '../../../shared/framework-config';

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

    const serviceWorkerEntry = frameworkConfig['service-worker'];

    const options: Object = {
      appShell: '/index.html',
      relativePaths: false,
      events: true,

      // TODO: autoUpdate option?

      // this is applied before any match in `caches` section
      excludes: [
        '**/*.gz',
        '**/*.br',
        '**/*.map',
        '**/*.LICENSE',
      ],

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,

      AppCache: false,
      ServiceWorker: {
      },
    };

    if (serviceWorkerEntry) {
      options.ServiceWorker.entry = serviceWorkerEntry;
    }

    if (this.isProd()) {

      // only enable cache in prod
      Object.assign(options, {
        caches: {
          main: [':rest:'],

          // All chunks marked as `additional`, loaded after main section
          // and do not prevent SW to install. Change to `optional` if
          // do not want them to be preloaded at all (cached only when first loaded)
          additional: ['*.chunk.js', ':externals:'],
        },
      });
    } else {
      Object.assign(options, {
        caches: {},
      });
    }

    config.injectPlugins([
      new OfflinePlugin(options),
    ]);
  }
}
