/* eslint-disable global-require */

import loadPolyfills from '../common/load-polyfills';
import { getDefault } from '../util/ModuleUtil';
import frameworkConfig from './framework-config';

(async function setupServer() {
  await loadPolyfills();

  const preInit = frameworkConfig['pre-init'];

  if (preInit) {
    const file = require(preInit);
    await getDefault(file);
  }

  require('./init');
}()).catch(e => {
  console.error(e);
  process.exit(1);
});
