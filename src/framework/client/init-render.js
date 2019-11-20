// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CookiesProvider } from 'react-cookie';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import { loadableReady } from '@loadable/component';
import { Router } from 'val-loader!./_react-router';
import { getDefault } from '../../shared/util/ModuleUtil';
import ReworkRootComponent from '../app/ReworkRootComponent';
import { rootRoute } from '../common/kernel';
import BrowserLanguageProvider from './browser-language-provider';
import ClientHooks from './client-hooks';

const helmetContext = {};
let rootComponent = (
  <HelmetProvider context={helmetContext}>
    <BrowserLanguageProvider>
      <CookiesProvider>
        <ReworkRootComponent>
          <Router>
            {rootRoute}
          </Router>
        </ReworkRootComponent>
      </CookiesProvider>
    </BrowserLanguageProvider>
  </HelmetProvider>
);

const clientHooks = ClientHooks.map(hookModule => {
  const HookClass = getDefault(hookModule);

  return new HookClass();
});

// allow plugins to add components
for (const clientHook of clientHooks) {
  if (clientHook.wrapRootComponent) {
    rootComponent = clientHook.wrapRootComponent(rootComponent);
  }
}

const appContainer = document.getElementById('app');
if (appContainer.hasChildNodes()) {
  // ensure all needed chunks are loaded before hydrating to prevent flicker
  loadableReady(() => {
    ReactDOM.hydrate(
      rootComponent,
      appContainer,
    );
  });
} else {
  ReactDOM.render(
    rootComponent,
    appContainer,
  );
}

// remove server-generated CSS
serverStyleCleanup();
