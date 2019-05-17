// @flow

import { useContext } from 'react';
import { SsrContext } from '../ssr-context';
import type { FetchCallback, StatusObject } from './typing.flow';

export type ResourceLoader<T> = {
  load: FetchCallback<T>,
  status?: StatusObject<T>,
};

export function useResource<T>(key: string, fetchCallback: FetchCallback<T>): StatusObject<T> {
  const { loadableResources } = useContext(SsrContext);

  if (!loadableResources) {
    throw new Error('server SSR Context is missing');
  }

  const resource = loadableResources.get(key) || {};
  loadableResources.set(key, resource);

  // we store .load because the SSR will use it and populate .status before the next render
  if (!resource.load) {
    resource.load = fetchCallback;
  }

  if (resource.status) {
    return { ...resource.status };
  }

  return {
    loading: true,
    value: void 0,
    error: void 0,
  };
}

