import '../../shared/regenerator';
import './source-map-support';
import { getDefault } from '../../shared/util/ModuleUtil';
import { installIntlPolyfill } from './intl-polyfil';

export default async function loadPreInit() {

  await installIntlPolyfill();

  // webpack
  const preInit = getDefault(require('@@pre-init'));
  if (typeof preInit === 'function') {
    await preInit();
  } else {
    await preInit;
  }
}
