import { resolveProject, resolveFrameworkSource } from '../../shared/resolve';

const defaultConfig = {
  directories: {
    build: resolveProject('.build'),
    resources: resolveProject('public'),
    routes: resolveProject('app/routes'),
    providers: resolveProject('app/providers'),
    translations: resolveProject('app/translations'),
  },

  'entry-react': resolveProject('app/containers/App'),
  'entry-html': resolveFrameworkSource('app/index.html'),
  'pre-init': resolveFrameworkSource('dummy/empty-function'),
};

export default defaultConfig;
