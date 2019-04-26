// @flow

import { useContext } from 'react';
import { SsrContext } from '../ssr-context';

export function useDnt(): string {

  const { req } = useContext(SsrContext);
  if (!req) {
    throw new Error('SSR Context is missing');
  }

  return req.get('DNT') || 'unspecified';
}
