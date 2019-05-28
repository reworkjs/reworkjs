// @flow

import { useRef } from 'react';
import type { UsePersistentValueParams } from './typing.flow';

export function usePersistentValue<T>(key: string, params: UsePersistentValueParams<T>): T {

  // TODO: add support for deserializing

  return useRef(params.init()).current;
}
