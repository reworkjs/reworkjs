import { resolveProject, resolveFrameworkSource } from '../../shared/resolve';

const defaultConfig = {
  directories: {
    logs: null,
    build: resolveProject('.build'),
    resources: resolveProject('public'),
    routes: resolveProject('app/routes'),
    providers: resolveProject('app/providers'),
    translations: resolveProject('app/translations'),
  },

  'entry-react': resolveProject('app/containers/App'),
  'pre-init': resolveFrameworkSource('dummy/empty-function'),
};

export default defaultConfig;
