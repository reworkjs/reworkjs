// @flow

// import app service worker
// eslint-disable-next-line import/no-unresolved
import 'val-loader!./_get-app-sw';

// allow update UX to install the new SW.
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * HACK: "InjectManifest" insists that "self. __WB_MANIFEST" must be mentioned *once* in the code,
 * But we don't use Workbox caching in Watch mode as its manifest is broken.
 *
 * So here we go:
 *
 * self.__WB_MANIFEST
 *
 * There
 *
 * See {@link ServiceWorkerFeature#visit} for more details
 */

if (process.env.NODE_ENV === 'production') {
  require('./_workbox');
}
