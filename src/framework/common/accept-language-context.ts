import type { Context } from 'react';
import { createContext } from 'react';

/**
 * This context contains the list of languages preferred by the user, in order of preference.
 *
 * Equivalent to the Accept-Language header or navigator.languages.
 *
 * @type {React.Context<Array<string>>}
 */
export const LanguageContext: Context<readonly string[]> = createContext(Object.freeze([] as string[]));
