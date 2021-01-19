// @flow

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
import { useEffect, useState } from 'react';

let updateAvailable = false;
const updateListeners = new Set();

// https://whatwebcando.today/articles/handling-service-worker-updates/
export function updateServiceWorker() {

  if (process.env.SIDE !== 'client') {
    return;
  }

  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.register) {
    return;
  }

  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.info('[SW] Registered');

      if (registration.waiting) {
        declareRestartRequired();
      }

      registration.addEventListener('updatefound', () => {
        // If updatefound is fired, it means that there's
        // a new service worker being installed.
        const installingWorker = registration.installing;
        if (!installingWorker) {
          return;
        }

        console.info('[SW] Update found');

        installingWorker.addEventListener('statechange', () => {
          if (registration.waiting) {
            declareRestartRequired();
          }
        });
      });
    })
    .catch(registrationError => {
      console.error('[SW] registration failed', registrationError);
    });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true; // prevent calling reload twice
      window.location.reload();
    }
  });
}

function declareRestartRequired() {
  updateAvailable = true;
  for (const listener of updateListeners) {
    listener(true);
  }
}

/**
 * React Hook to detect whether a service-worker is awaiting activation.
 *
 * @returns {boolean} Whether a service-worker is awaiting activation.
 */
export function useRestartRequired() {

  const [hasUpdate, setHasUpdate] = useState(updateAvailable);

  useEffect(() => {
    const listener = newUpdate => {
      setHasUpdate(newUpdate);
    };

    updateListeners.add(listener);

    return () => {
      updateListeners.delete(listener());
    };
  }, []);

  return hasUpdate;
}

/**
 * Cause the waiting service worker to activate, becoming the controlling SW,
 *  which in turn will cause the page to refresh.
 *
 * @returns {Promise<void>}
 */
export async function updateSwAndRestart() {
  const registration = await navigator.serviceWorker.ready;

  if (registration.waiting) {
    // let waiting Service Worker know it should became active
    registration.waiting.postMessage('SKIP_WAITING');
  }
}
