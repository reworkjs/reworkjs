// @flow

import { getDefault } from '../../shared/util/ModuleUtil';

export default async function loadPreInit() {

  // webpack
  const preInit = getDefault(require('@@pre-init'));
  if (typeof preInit === 'function') {
    await preInit();
  } else {
    await preInit;
  }
}
