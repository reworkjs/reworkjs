import preInit from '../common/pre-init';

preInit().then(() => {
  require('./init-render'); // eslint-disable-line global-require
});
