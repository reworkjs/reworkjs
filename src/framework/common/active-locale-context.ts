import type { Context } from 'react';
import { createContext, useContext } from 'react';

type ValueType = {
  activeLocale: string,
  setActiveLocale(newLocale: string): void,
};

/**
 * This context contains the currently active locale for the application, and a function to change it.
 */
export const ActiveLocaleContext: Context<ValueType> = createContext({
  // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
  activeLocale: 'en',
  setActiveLocale: (_newLocale: string) => {},
});

export function useActiveLocaleContext(): ValueType {
  return useContext(ActiveLocaleContext);
}
