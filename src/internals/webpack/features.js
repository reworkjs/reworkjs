import requireAll from 'require-all';
import { getDefault } from '../../shared/util/ModuleUtil';
import BaseFeature from './BaseFeature';

const modules = requireAll({
  dirname: `${__dirname}/features`,
  filter: /(.+)\.js$/,
  recursive: true,
});

const featureClasses: BaseFeature[] = Object.keys(modules)
  .map(featureName => {
    return getDefault(modules[featureName]);
  });
for (const moduleName of Object.keys(modules)) {
  modules[moduleName] = getDefault(modules[moduleName]);
}

Object.freeze(featureClasses);

export default featureClasses;
