import { resolveProject, resolveFramework } from '../util/RequireUtil';

const defaultConfig = {
  directories: {
    build: resolveProject('.build'),
    resources: resolveProject('public'),
    routes: resolveProject('app/routes'),
    providers: resolveProject('app/providers'),
    translations: resolveProject('app/translations'),
  },

  'entry-react': resolveProject('app/containers/App'),
  'entry-html': resolveFramework('app/index.html'),
};

export default defaultConfig;
