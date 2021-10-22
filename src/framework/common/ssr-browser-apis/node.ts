import { useContext } from 'react';
import { LanguageContext } from '../accept-language-context.js';
import { SsrContext } from '../ssr-context.js';

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

export function useLocation(): URL {

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
