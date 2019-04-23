// @flow

import React from 'react';
import Helmet from 'react-helmet';
import { withCookies, type Cookies } from 'react-cookie';
import { guessPreferredLocale } from '../common/i18n/get-preferred-locale';
import { LanguageContext } from '../common/accept-language-context';
import withContext from '../common/with-context';

type Props = {
  cookies: Cookies,
  acceptLanguages: string[],
};

function BaseHelmet(props: Props) {

  // is process.env.SIDE is null, we're the build process. Use default value.
  // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
  const lang = process.env.SIDE == null ? 'en' : getLangFromLocale(guessPreferredLocale(props.cookies, props.acceptLanguages));

  return (
    <Helmet>
      <html lang={lang} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Helmet>
  );
}

function getLangFromLocale(locale) {
  return locale.split(/[-_]/)[0];
}

// only inject cookies if we're in HTTP server or the browser context
// not if we're the builder.
export default process.env.SIDE == null
  ? BaseHelmet
  : withContext({ acceptLanguages: LanguageContext })(withCookies(BaseHelmet));
