import { enable as enableNavigationPreload } from 'workbox-navigation-preload/enable';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { NavigationRoute } from 'workbox-routing/NavigationRoute';
import { registerRoute } from 'workbox-routing/registerRoute';
import { NetworkOnly } from 'workbox-strategies/NetworkOnly';

// download assets ahead of time & create routes to them.
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/index.html';
// Populate the cache with the offline HTML page.
self.addEventListener('install', async event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(FALLBACK_HTML_URL)),
  );
});

enableNavigationPreload();

const networkOnly = new NetworkOnly();
const navigationHandler = async params => {
  try {
    // Attempt a network request.
    return await networkOnly.handle(params);
  } catch (error) {
    // If it fails, return the cached HTML.
    return caches.match(FALLBACK_HTML_URL, {
      cacheName: CACHE_NAME,
    });
  }
};

// Register this strategy to handle all navigations.
registerRoute(
  new NavigationRoute(navigationHandler),
);
