
import preInit from '@@pre-init'; // webpack import
import { shouldPolyfill } from '@formatjs/intl-locale/should-polyfill.js';

export default async function loadPreInit() {
  if (shouldPolyfill()) {
    await import('@formatjs/intl-locale/polyfill.js');
  }

  if (typeof preInit === 'function') {
    await preInit();
  } else {
    await preInit;
  }
}
