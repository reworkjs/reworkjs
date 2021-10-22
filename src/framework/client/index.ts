import preInit from '../common/pre-init.js';

void preInit().then(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./init-render.js');
});
