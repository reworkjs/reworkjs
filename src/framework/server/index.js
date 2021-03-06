import preInit from '../common/pre-init';

process.on('unhandledRejection', reason => {
  console.error('Unhandled Rejections:');
  console.error(reason);

  process.exit(1);
});

preInit().then(() => {
  require('./launch-http-server'); // eslint-disable-line global-require
});
