// @flow

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
import { useEffect, useState } from 'react';

let updateAvailable = false;
const updateListeners = new Set();

export function updateServiceWorker() {

  if (process.env.SIDE === 'client') {
    try {
      const runtime = require('offline-plugin/runtime');

      runtime.install({
        onUpdateReady: () => {
          runtime.applyUpdate();
        },
        onUpdated: () => {
          updateAvailable = true;
          for (const listener of updateListeners) {
            listener(updateAvailable);
          }
        },
      });
    } catch (e) {
      console.error('Service Worker update failed');
      console.error(e);
    }
  }
}

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
