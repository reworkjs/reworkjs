import global from 'global';
import '../../shared/regenerator';
import './source-map-support';

export default function loadPolyfills() {
  const promises = [];

  if (!global.Intl) {
    promises.push(
      import('intl'),
      import('intl/locale-data/jsonp/en.js'),
    );
  }

  // if (process.env.SIDE !== 'browser') { // eslint-disable-line
  // promises.push(import('source-map-support').then(module => {
  //   (module || module.default).install();
  // }));
  // }

  return Promise.all(promises);
}
