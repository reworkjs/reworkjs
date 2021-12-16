import preInit from '../common/pre-init.js';

void preInit().then(() => {
  import(/* webpackPreload: true */ './init-render.js');
});
