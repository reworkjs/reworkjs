// @flow

import { useContext } from 'react';
import { SsrContext } from '../ssr-context';
import type { FetchCallback, StatusObject } from './typing.flow';

export type ResourceLoader<T> = {
  load: FetchCallback<T>,
  status?: StatusObject<T>,
};

/**
 * Loads a resource in a SSR compatible way.
 * Calling this will cause a re-render of react if there are new resources to load after a render. Avoid
 * chaining new resources as much as possible.
 *
 * The way this hook works is that it will give you a {@see StatusObject} object representing the loading status
 * of your resource. On servers, the framework will do a second render when the resources are loaded.
 *
 * Your resource MUST BE serializable by JSON.serializable as it will be transferred with the server-side rendering payload.
 *
 * @param {!string} key - A unique key identifying the resource. It must be stable between two renders.
 * @param {!Function} fetchCallback - The function used to load the resource. Must return a Promise that resolves a JSON-serializable value.
 * @returns {!StatusObject} The loading status of the resource.
 */
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

