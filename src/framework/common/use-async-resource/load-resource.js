// @flow

import type { FetchCallback, StatusObject } from './typing.flow';

export function loadResource<T>(fetchCallback: FetchCallback<T>): Promise<StatusObject<T>> {

  return Promise.resolve()
    .then(fetchCallback)
    .then(value => {
      return {
        loading: false,
        value,
        error: void 0,
      };
    }, error => {
      return {
        loading: false,
        value: void 0,
        error,
      };
    });
}
