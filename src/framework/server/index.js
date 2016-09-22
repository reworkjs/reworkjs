/* eslint-disable global-require */

import loadPolyfills from '../common/load-polyfills';
import { getDefault } from '../../shared/util/ModuleUtil';

(async function setupServer() {
  await loadPolyfills();

  // webpack
  const file = require('@@pre-init'); // eslint-disable-line
  await getDefault(file);

  require('./init');
}()).catch(e => {
  console.error(e);
  process.exit(1);
});
