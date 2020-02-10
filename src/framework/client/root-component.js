// @flow

import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { getDefault } from '../../shared/util/ModuleUtil';
import ReworkRootComponent from '../app/ReworkRootComponent';
import { rootRoute } from '../common/kernel';
// eslint-disable-next-line import/no-unresolved
import { isHash } from 'val-loader!./_react-router';
import BrowserLanguageProvider from './browser-language-provider';
import ClientHooks from './client-hooks';

const clientHooks = ClientHooks.map(hookModule => {
  const HookClass = getDefault(hookModule);

  return new HookClass();
});

let RootComponent = () => {

  const basename = isHash ? `${location.pathname}#` : '';

  if (!location.hash.startsWith('#')) {
    location.hash = '#';
  }

  let rootElement = (
    <BrowserLanguageProvider>
      <HelmetProvider>
        <CookiesProvider>
          <ReworkRootComponent>
            <BrowserRouter basename={basename}>
              {rootRoute}
            </BrowserRouter>
          </ReworkRootComponent>
        </CookiesProvider>
      </HelmetProvider>
    </BrowserLanguageProvider>
  );

  // allow plugins to add components
  for (const clientHook of clientHooks) {
    if (clientHook.wrapRootComponent) {
      rootElement = clientHook.wrapRootComponent(rootElement);
    }
  }

  return rootElement;
};

if (module.hot) {
  const { hot } = require('react-hot-loader/root');

  RootComponent = hot(RootComponent);
}

export default RootComponent;
