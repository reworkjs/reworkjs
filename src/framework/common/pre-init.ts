
import { shouldPolyfill } from '@formatjs/intl-locale/should-polyfill.js';
import { getDefault } from '../../shared/util/module-util.js';

export default async function loadPreInit() {
  if (shouldPolyfill()) {
    await import('@formatjs/intl-locale/polyfill.js');
  }

  // webpack
  const preInit = getDefault(require('@@pre-init'));
  if (typeof preInit === 'function') {
    await preInit();
  } else {
    await preInit;
  }
}
