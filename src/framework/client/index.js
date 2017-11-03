/* eslint-disable */

import preInit from '../common/pre-init';

preInit().then(() => {
  require('./init-render');
}).catch(e => {
  console.error('Error while rendering client');
  console.dir(e);
});
