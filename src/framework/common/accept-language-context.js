// @flow

import * as React from 'react';

/**
 * This context contains the list of languages preferred by the user, in order of preference.
 *
 * Equivalent to the Accept-Language header or navigator.languages.
 *
 * @type {React.Context<Array<string>>}
 */
const LanguageContext: React.Context<string[]> = React.createContext([]);

export const LanguageProvider = LanguageContext.Provider;
export const LanguageConsumer = LanguageContext.Consumer;

export { LanguageContext };
