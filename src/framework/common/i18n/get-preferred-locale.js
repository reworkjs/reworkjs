// @flow

import type { Cookies } from 'react-cookie';
import { isTranslationSupported } from './index';

export const LOCALE_COOKIE_NAME = 'rjs-locale';

export function storePreferredLocale(cookie: Cookies, locale: string) {
  if (cookie && cookie.get(LOCALE_COOKIE_NAME) !== locale) {
    cookie.set(LOCALE_COOKIE_NAME, locale, { path: '/' });
  }
}

export function guessPreferredLocale(cookies: Cookies, acceptLanguages: string[]) {
  // TODO add hook ?

  const cookieLocale = cookies.get(LOCALE_COOKIE_NAME);
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
