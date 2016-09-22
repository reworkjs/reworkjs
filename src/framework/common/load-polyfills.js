import global from 'global';
import '../../shared/regenerator';

// const System = global.System ? { import: global.System.import } : {};

// if (!System.import) {
//   System.import = function sysImport(arg) {
//     return require(arg); // eslint-disable-line global-require
//   };
// }

export default function loadPolyfills() {
  const promises = [];

  if (!global.Intl) {
    promises.push(
      System.import('intl'),
      System.import('intl/locale-data/jsonp/en.js'),
    );
  }

  return Promise.all(promises);
}
