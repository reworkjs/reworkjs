/* eslint-disable global-require */

import loadPolyfills from '../common/load-polyfills';
import { getDefault } from '../../shared/util/ModuleUtil';

(async function setupServer() {
  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejections:');
    console.error(reason);
    console.error('Caused by:');
    console.error(p);

    process.exit(1);
  });

  await loadPolyfills();

  // webpack
  const file = require('@@pre-init'); // eslint-disable-line
  await getDefault(file);

  require('./init');
}()).catch(e => {
  console.error(e);
  process.exit(1);
});
