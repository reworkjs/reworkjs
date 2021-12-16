import preInit from '../common/pre-init.js';

process.on('unhandledRejection', reason => {
  console.error('Unhandled Rejections:');
  console.error(reason);

  process.exit(1);
});

await preInit();
await import('./launch-http-server.js');
