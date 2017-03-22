import React from 'react';
import Helmet from 'react-helmet';

export default function BaseHelmet() {
  return (
    <Helmet>
      <html lang="en" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Helmet>
  );
}
