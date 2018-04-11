import { getCurrentRequestLocales } from '../server/setup-http-server/request-locale';
import { isLocaleValid } from './i18n';

export const LOCALE_COOKIE_NAME = 'rjs-locale';

export function storePreferredLocale(cookie, locale) {
  if (cookie && cookie.get(LOCALE_COOKIE_NAME) !== locale) {
    cookie.set(LOCALE_COOKIE_NAME, locale, { path: '/' });
  }
}

export function guessPreferredLocale(cookies) {
  // TODO add hook ?

  const cookieLocale = cookies.get(LOCALE_COOKIE_NAME);
  if (cookieLocale && isLocaleValid(cookieLocale)) {
    return cookieLocale;
  }

  // client-side
  if (typeof navigator !== 'undefined') {
    if (navigator.languages) {
      for (const language of navigator.languages) {
        if (isLocaleValid(language)) {
          return language;
        }
      }
    }

    if (isLocaleValid(navigator.language)) {
      return navigator.language;
    }
  }

  // server-side
  const serverLocales = getCurrentRequestLocales();
  if (serverLocales) {
    for (const serverLocale of serverLocales) {
      if (isLocaleValid(serverLocale)) {
        return serverLocale;
      }
    }
  }

  return 'en';
}
