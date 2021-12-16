import { useRef } from 'react';
import type { UsePersistentValueParams } from './typings.js';

export function usePersistentValue<T>(_key: string, params: UsePersistentValueParams<T>): T {

  // TODO: add support for deserializing

  return useRef(params.init()).current;
}
