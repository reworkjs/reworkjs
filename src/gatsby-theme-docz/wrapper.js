import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Helmet } from 'react-helmet-async';
import logo from './components/Logo/logo.png';

const Wrapper = ({ children }) => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>rework.js</title>
      <link
        rel="icon"
        type="image/png"
        href={logo}
      />
    </Helmet>
    {children}
  </>
);

export default Wrapper;
