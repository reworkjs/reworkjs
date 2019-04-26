// @flow

import { useContext } from 'react';
import { SsrContext } from '../ssr-context';

export function useLocation(): string {

  const { req } = useContext(SsrContext);

  if (!req) {
    throw new Error('SSR Context is missing');
  }

  const host = req.get('host');

  if (!host) {
    throw new Error('Could not determine host');
  }

  return `${req.protocol}://${host}${req.originalUrl}`;
}
