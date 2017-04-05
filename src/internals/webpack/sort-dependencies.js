import TopoSort from 'toposort-class';
import forEach from '../../shared/util/for-each';
import BaseFeature from './BaseFeature';

// handle '*'
const BEFORE_ALL = '$$first';
const AFTER_ALL = '$$last';

export default function sortDependencies(modules: BaseFeature[]) {

  // key => dependencies
  const moduleDependencyMap = {
    [BEFORE_ALL]: [],
    [AFTER_ALL]: [BEFORE_ALL],
  };

  for (const dep of modules) {
    const name = dep.getFeatureName();

    if (!/^[a-z0-9_-]+$/.test(name)) {
      throw new TypeError(`Feature names must be all lowercase, and use characters a-z, 0-9, _ and - only. (received ${name})`);
    }

    moduleDependencyMap[name] = moduleDependencyMap[name] || [];

    // this dep should be loaded after those
    const beforeThis = dep.loadAfter();
    let isAfterAll = false;
    if (beforeThis) {
      forEach(beforeThis, before => {
        if (before === '*') {
          isAfterAll = true;
          return;
        }

        moduleDependencyMap[name].push(before);
      });
    }

    const afterThis = dep.loadBefore();
    let isBeforeAll = false;
    if (afterThis) {
      forEach(afterThis, after => {
        // every dependency should be loaded after this one.
        if (after === '*') {
          isBeforeAll = true;
          return;
        }

        moduleDependencyMap[after] = moduleDependencyMap[after] || [];
        moduleDependencyMap[after].push(name);
      });
    }

    if (isBeforeAll) {
      moduleDependencyMap[BEFORE_ALL].push(name);
    } else {
      moduleDependencyMap[name].push(BEFORE_ALL);
    }

    if (isAfterAll) {
      moduleDependencyMap[name].push(AFTER_ALL);
    } else {
      moduleDependencyMap[AFTER_ALL].push(name);
    }
  }

  const sorter = new TopoSort();

  for (const featureName of Object.keys(moduleDependencyMap)) {
    sorter.add(featureName, moduleDependencyMap[featureName]);
  }

  const loadOrder = sorter.sort().reverse();

  modules.sort((a, b) => {
    return loadOrder.indexOf(a.getFeatureName()) - loadOrder.indexOf(b.getFeatureName());
  });
}
