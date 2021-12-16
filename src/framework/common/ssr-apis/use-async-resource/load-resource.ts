import type { FetchCallback, StatusObject } from './typings.js';

export async function loadResource<T>(fetchCallback: FetchCallback<T>): Promise<StatusObject<T>> {
  try {
    const value = await fetchCallback();

    return {
      loading: false,
      value,
      error: void 0,
    };
  } catch (e) {
    return {
      loading: false,
      value: void 0,
      error: e,
    };
  }
}
