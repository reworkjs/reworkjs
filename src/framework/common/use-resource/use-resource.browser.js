// @flow

import { useRef, useState } from 'react';
import { loadResource } from './load-resource';
import type { FetchCallback, StatusObject } from './typing.flow';

export function useResource<T>(key: string, fetchCallback: FetchCallback<T>): StatusObject<T> {
  const fetchCalled = useRef(false);
  const [status, setStatus] = useState<StatusObject<T>>({
    loading: true,
    value: void 0,
    error: void 0,
  });

  if (!fetchCalled.current) {
    fetchCalled.current = true;

    loadResource(fetchCallback).then(newStatus => {
      setStatus(newStatus);
    });
  }

  return status;
}
