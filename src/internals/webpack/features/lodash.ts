import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import frameworkMetadata from '@reworkjs/core/_internal_/framework-metadata';
import findCacheDir from 'find-cache-dir';
import BaseFeature from '../BaseFeature.js';
import type WebpackConfigBuilder from '../WebpackConfigBuilder.js';

// TODO: remove once import.meta.resolve is ready
const require = createRequire(import.meta.url);

/**
 * This feature aliases lodash-es and lodash.<part> packages to lodash
 * And transforms code to remove unused lodash features.
 */
export default class LodashFeature extends BaseFeature {

  getFeatureName() {
    return 'lodash';
  }

  isDefaultEnabled() {
    return this.isProd();
  }

  getDescription() {
    return 'Optimises the lodash bundle. It aliases all known versions of lodash to lodash-es for tree-shaking.';
  }

  visit(webpack: WebpackConfigBuilder) {
    webpack.injectAlias('lodash-es', 'lodash');

    for (const module of getLodashModules()) {
      webpack.injectAlias(`lodash.${module}`, `lodash/${module}`);
    }

    // Run babel-plugin-lodash on node_modules
    webpack.injectRules({
      test: BaseFeature.FILE_TYPE_JS,
      loader: 'babel-loader',
      include: [getNodeModules()],
      exclude: [getLodashDir()],
      options: {
        babelrc: false,
        configFile: false,
        plugins: ['lodash', '@babel/plugin-syntax-dynamic-import'],
        cacheDirectory: `${findCacheDir({
          name: frameworkMetadata.name,
        })}/babel-lodash`,
        sourceType: 'unambiguous',
      },
    });
  }
}

function getNodeModules() {
  return path.dirname(getLodashDir());
}

function getLodashDir() {
  return path.dirname(require.resolve('lodash'));
}

function getLodashModules() {
  const moduleNames = fs.readdirSync(getLodashDir());

  return moduleNames
    .filter(moduleName => moduleName.endsWith('.js'))
    .map(moduleName => {
      return moduleName.substring(moduleName.length - 3, 0);
    });
}
