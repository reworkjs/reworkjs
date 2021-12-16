import { useAcceptLanguage } from '@reworkjs/core/ssr';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
import { guessPreferredLocale, LOCALE_COOKIE_NAME } from './i18n/get-preferred-locale.js';

function BaseHelmet() {

  // if process.env.SIDE is null, we're the build process. Use default value.
  // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
  let lang = 'en';
  if (process.env.SIDE == null) { // .SIDE is immutable
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const acceptLanguages = useAcceptLanguage();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cookies] = useCookies([LOCALE_COOKIE_NAME]);

    lang = getLangFromLocale(guessPreferredLocale(cookies[LOCALE_COOKIE_NAME], acceptLanguages));
  }

  return (
    <Helmet>
      <html lang={lang} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Helmet>
  );
}

function getLangFromLocale(locale: string) {
  return locale.split(/[-_]/)[0];
}

// only inject cookies if we're in HTTP server or the browser context
// not if we're the builder.
export default BaseHelmet;
