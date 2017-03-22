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

  return Promise.all(promises);
}
