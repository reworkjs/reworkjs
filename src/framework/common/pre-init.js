// @flow

import { shouldPolyfill } from '@formatjs/intl-locale/should-polyfill';
import { getDefault } from '../../shared/util/ModuleUtil';

export default async function loadPreInit() {
  if (shouldPolyfill()) {
    await import('@formatjs/intl-locale/polyfill');
  }

  // webpack
  const preInit = getDefault(require('@@pre-init'));
  if (typeof preInit === 'function') {
    await preInit();
  } else {
    await preInit;
  }
}
