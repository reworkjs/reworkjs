import React from 'react';
import Helmet from 'react-helmet';
import { withCookies } from 'react-cookie';
import { guessPreferredLocale } from '../common/get-preferred-locale';

function BaseHelmet(props) {

  // is process.env.SIDE is null, we're the build process. Use default value.
  const lang = process.env.SIDE == null ? 'en' : getLangFromLocale(guessPreferredLocale(props.cookies));

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
export default process.env.SIDE == null ? BaseHelmet : withCookies(BaseHelmet);
