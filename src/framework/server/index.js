import preInit from '../common/pre-init';

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejections:');
  console.error(reason);
  console.error('Caused by:');
  console.error(p);

  process.exit(1);
});

preInit().then(() => {
  require('./init'); // eslint-disable-line global-require
});
