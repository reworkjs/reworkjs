import { DEFAULT_LOCALE } from '@reworkjs/core/_internal_/translations';
import { isTranslationSupported } from './index.js';

export const LOCALE_COOKIE_NAME = 'rjs-locale';

export function guessPreferredLocale(cookieLocale: string | null, acceptLanguages: readonly string[]) {
  // TODO add hook ?

  if (cookieLocale && isTranslationSupported(cookieLocale)) {
    return cookieLocale;
  }

  for (const language of acceptLanguages) {
    if (isTranslationSupported(language)) {
      return language;
    }
  }

  return DEFAULT_LOCALE;
}
