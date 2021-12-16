import 'val-loader!./_get-app-sw.cjs';

// allow update UX to install the new SW.
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
