import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import { loadableReady } from '@loadable/component';
import { getDefault } from '../../shared/util/ModuleUtil';
import ReworkRootComponent from '../app/ReworkRootComponent';
import { rootRoute } from '../common/kernel';
import BrowserLanguageProvider from './browser-language-provider';
import ClientHooks from './client-hooks';

// TODO: support hashHistory somehow (cli option ?)

let rootComponent = (
  <BrowserLanguageProvider>
    <CookiesProvider>
      <ReworkRootComponent>
        <Router history={createBrowserHistory()}>
          {rootRoute}
        </Router>
      </ReworkRootComponent>
    </CookiesProvider>
  </BrowserLanguageProvider>
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
