import global from 'global';
import '../../shared/regenerator';
import './source-map-support';
import { getDefault } from '../../shared/util/ModuleUtil';

export default async function loadPreInit() {
  await loadReworkPolyfills();

  // webpack
  const preInit = getDefault(require('@@pre-init')); // eslint-disable-line
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

  if (typeof Symbol === 'undefined') {
    promises.push(import('core-js/modules/es6.symbol'));
  }

  return Promise.all(promises);
}
