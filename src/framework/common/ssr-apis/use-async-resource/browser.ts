import { useEffect, useState } from 'react';
import { loadResource } from './load-resource.js';
import type { FetchCallback, StatusObject } from './typings.js';

export function useAsyncResource<T>(key: string, fetchCallback: FetchCallback<T>): StatusObject<T> {
  const [status, setStatus] = useState<StatusObject<T>>({
    loading: true,
    value: void 0,
    error: void 0,
  });

  useEffect(() => {
    void loadResource(fetchCallback).then(newStatus => {
      setStatus(newStatus);
    });
  }, [fetchCallback, key]);

  return status;
}

