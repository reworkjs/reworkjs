import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import { getDefault } from '../../shared/util/ModuleUtil';
import ReworkRootComponent from '../app/ReworkRootComponent';
import { rootRoute } from '../common/kernel';
import ClientHooks from './client-hooks';

// TODO: support hashHistory somehow (cli option ?)

let rootComponent = (
  <CookiesProvider>
    <ReworkRootComponent>
      <Router history={createBrowserHistory()}>
        {rootRoute}
      </Router>
    </ReworkRootComponent>
  </CookiesProvider>
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

ReactDOM.render(
  rootComponent,
  document.getElementById('app'),
);

// remove server-generated CSS
serverStyleCleanup();
