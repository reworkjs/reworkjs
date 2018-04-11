import global from 'global';
import '../../shared/regenerator';
import './source-map-support';
import { getDefault } from '../../shared/util/ModuleUtil';

export default async function loadPreInit() {
  await loadReworkPolyfills();

  // webpack
  const preInit = getDefault(require('@@pre-init'));
  if (typeof preInit === 'function') {
    await preInit();
  } else {
    await preInit;
  }
}

/**
 * Load the list of polyfills used by reworkjs
 */
function loadReworkPolyfills() {
  const promises = [];

  if (!global.Intl) {
    promises.push(
      import('intl'),

      // TODO dynamically load appropriate intl locales
      import('intl/locale-data/jsonp/en.js'),
    );
  }

  return Promise.all(promises);
}
