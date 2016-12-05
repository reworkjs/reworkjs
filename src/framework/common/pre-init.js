import loadPolyfills from '../common/load-polyfills';
import { getDefault } from '../../shared/util/ModuleUtil';

export default async function loadPreInit() {
  await loadPolyfills();

  // webpack
  const preInit = getDefault(require('@@pre-init')); // eslint-disable-line
  if (typeof preInit === 'function') {
    await preInit();
  } else {
    await preInit;
  }
}
