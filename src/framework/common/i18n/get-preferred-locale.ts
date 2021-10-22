import { isTranslationSupported } from '.';

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

  // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
  return 'en';
}
