// @flow

import * as React from 'react';

type ValueType = {
  activeLocale: string,
  setActiveLocale: (string) => void,
};

/**
 * This context contains the currently active locale for the application, and a function to change it.
 */
const ActiveLocaleContext: React.Context<ValueType> = React.createContext({
  // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
  activeLocale: 'en',
  setActiveLocale: () => {},
});

export const ActiveLocaleProvider = ActiveLocaleContext.Provider;
export const ActiveLocaleConsumer = ActiveLocaleContext.Consumer;
