import loadPolyfills from '../common/load-polyfills';
import { getDefault } from '../../shared/util/ModuleUtil';
import logger from '../../shared/logger';

export default async function loadPreInit() {
  await loadPolyfills();

  // webpack
  const preInit = getDefault(require('@@pre-init')); // eslint-disable-line
  if (!preInit) {
    logger.debug('No pre-init file.');
  } else {
    if (typeof preInit === 'function') {
      await preInit();
    } else {
      await preInit;
    }

    logger.debug('pre-init loaded.');
  }
}
