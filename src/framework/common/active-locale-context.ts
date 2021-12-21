import type { Context } from 'react';
import { createContext, useContext } from 'react';

export type TActiveLocaleContext = [
  activeLocale: string,
  setActiveLocale: (newLocale: string) => void,
];

/**
 * This context contains the currently active locale for the application, and a function to change it.
 */
export const ActiveLocaleContext: Context<TActiveLocaleContext> = createContext([
  // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
  'en',
  (_newLocale: string) => {},
]);

export function useActiveLocale(): TActiveLocaleContext {
  return useContext(ActiveLocaleContext);
}
