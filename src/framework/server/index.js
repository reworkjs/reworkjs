process.on('unhandledRejection', reason => {
  console.error('Unhandled Rejections:');
  console.error(reason);

  process.exit(1);
});

// eslint-disable-next-line import/no-commonjs
require('./launch-http-server');
