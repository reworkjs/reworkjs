import global from 'global';
import '../../shared/regenerator';
import { isServer } from '../../shared/EnvUtil';

export default function loadPolyfills() {
  const promises = [];

  if (!global.Intl) {
    promises.push(
      import('intl'),
      import('intl/locale-data/jsonp/en.js'),
    );
  }

  if (isServer) { // eslint-disable-line
    promises.push(import('source-map-support/register'));
  }

  return Promise.all(promises);
}
