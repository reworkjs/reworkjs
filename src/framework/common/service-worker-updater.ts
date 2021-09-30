import { useEffect, useState } from 'react';

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed

let updateAvailable = false;
const updateListeners = new Set<(enabled?: boolean) => any>();

let _serviceWorkerPromise;

export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.register) {
    return null;
  }

  if (!_serviceWorkerPromise) {
    _serviceWorkerPromise = navigator.serviceWorker.register('/sw.js');
  }

  return _serviceWorkerPromise;
}

export async function checkForServiceWorkerUpdates(): Promise<void> {
  const serviceWorker = await getServiceWorkerRegistration();
  if (serviceWorker == null) {
    return;
  }

  await serviceWorker.update();
}

// https://whatwebcando.today/articles/handling-service-worker-updates/
export function updateServiceWorker() {

  if (process.env.SIDE !== 'client') {
    return;
  }

  getServiceWorkerRegistration()
    .then(registration => {
      if (registration == null) {
        return;
      }

      console.info('[SW] Registered');

      const onUpdateFound = installingWorker => {
        console.info('[SW] Update found');

        installingWorker.addEventListener('statechange', () => {
          if (registration.waiting) {
            declareRestartRequired();
          }
        });
      };

      if (registration.waiting) {
        declareRestartRequired();
      }

      if (registration.installing) {
        onUpdateFound(registration.installing);
      }

      registration.addEventListener('updatefound', () => {
        // If updatefound is fired, it means that there's
        // a new service worker being installed.
        if (registration.installing) {
          onUpdateFound(registration.installing);
        }
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
      updateListeners.delete(listener);
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
