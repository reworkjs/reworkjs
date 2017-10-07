import fs from 'fs';
import path from 'path';
import BaseFeature from '../BaseFeature';

/**
 * This feature aliases lodash-es and lodash.<part> packages to lodash
 * And transforms code to remove unused lodash features.
 */
export default class LodashFeature extends BaseFeature {

  getFeatureName() {
    return 'lodash';
  }

  isEnabled(enabled) {
    if (!this.isProd()) {
      return false;
    }

    return super.isEnabled(enabled);
  }

  getDescription() {
    return 'Optimises the lodash bundle. It aliases all known versions of lodash to lodash-es for tree-shaking.';
  }

  visit(webpack) {
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
        plugins: ['lodash', 'syntax-dynamic-import'],
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
