import { useContext } from 'react';
import { SsrContext } from '../ssr-context.js';
import type { UsePersistentValueParams } from './typings.js';

export function usePersistentValue<T>(key: string, params: UsePersistentValueParams<T>): T {

  // TODO: add support for serializing

  const { persistentValues } = useContext(SsrContext);

  if (!persistentValues) {
    throw new Error('server SSR Context is missing');
  }

  if (persistentValues.has(key)) {
    // $FlowFixMe - flow doesn't care about .has
    return persistentValues.get(key);
  }

  const val = params.init();
  persistentValues.set(key, val);

  return val;
}
