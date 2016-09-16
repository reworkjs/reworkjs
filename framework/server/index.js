/* eslint-disable global-require */

import '../common/regenerator-runtime';
import { getDefault } from '../util/ModuleUtil';
import frameworkConfig from './framework-config';

(async function setupServer() {
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
