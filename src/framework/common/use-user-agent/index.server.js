// @flow

import { useContext } from 'react';
import { SsrContext } from '../ssr-context';

export function useUserAgent(): string {

  const { req } = useContext(SsrContext);
  if (!req) {
    throw new Error('SSR Context is missing');
  }

  return req.get('User-Agent') || '';
}
