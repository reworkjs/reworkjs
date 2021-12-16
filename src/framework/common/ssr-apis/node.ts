import { useContext } from 'react';
import { LanguageContext } from '../accept-language-context.js';
import { SsrContext } from '../ssr-context.js';

export { SsrContext } from '../ssr-context.js';

// Browser metadata that are available on the server through headers & on the browser through the JS api.

export { useAsyncResource } from './use-async-resource/node.js';
export { usePersistentValue } from './use-persistent-value/node.js';

export function useDnt(): string {

  const { req } = useContext(SsrContext);
  if (!req) {
    throw new Error('SSR Context is missing');
  }

  return req.get('DNT') || 'unspecified';
}

export function useUserAgent(): string {

  const { req } = useContext(SsrContext);
  if (!req) {
    throw new Error('SSR Context is missing');
  }

  return req.get('User-Agent') || '';
}

export function useSsrLocation(): URL {

  const { req } = useContext(SsrContext);

  if (!req) {
    throw new Error('SSR Context is missing');
  }

  const host = req.get('host');

  if (!host) {
    throw new Error('Could not determine host');
  }

  return new URL(`${req.protocol}://${host}${req.originalUrl}`);
}

export function useAcceptLanguage(): readonly string[] {
  return useContext(LanguageContext);
}
