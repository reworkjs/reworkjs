import fs from 'fs';
import path from 'path';
import BaseFeature from '../BaseFeature';

/**
 * This feature aliases lodash and lodash.<part> packages to lodash-es
 */
export default class LodashFeature extends BaseFeature {

  getFeatureName() {
    return 'lodash';
  }

  getDescription() {
    return 'Optimises the lodash bundle. It aliases all known versions of lodash to lodash-es for tree-shaking.';
  }

  visit(webpack) {
    webpack.injectAlias('lodash', 'lodash-es');

    for (const module of getLodashModules()) {
      webpack.injectAlias(`lodash.${module}`, `lodash-es/${module}`);
    }
  }
}

function getLodashModules() {
  const moduleNames = fs.readdirSync(path.dirname(require.resolve('lodash')));

  return moduleNames
    .filter(moduleName => moduleName.endsWith('.js'))
    .map(moduleName => {
      return moduleName.substring(moduleName.length - 3, 0);
    });
}
