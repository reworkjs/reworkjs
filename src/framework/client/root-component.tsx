import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { isHash } from 'val-loader!./_react-router.codegen.cjs';
import { getDefault } from '../../shared/util/module-util.js';
import ReworkRootComponent from '../common/ReworkRootComponent.js';
import { rootRoute } from '../common/kernel.js';
import ClientHooks from './client-hooks/index.js';

const clientHooks = ClientHooks.map(hookModule => {
  const HookClass = getDefault(hookModule);

  return new HookClass();
});

const RootComponent = () => {
  const location = globalThis.location;
  const didCleanUrl = React.useRef(!isHash);

  const basename = isHash ? `${location.pathname}#` : '';

  if (!didCleanUrl.current && isHash) {
    // avoid resetting the url
    didCleanUrl.current = true;

    // URL format must be "pathname[?search][#fragment]"
    // because we use #fragment for routing, we cannot have a search query
    //  BEFORE the fragment or router will break.
    // We instead move it after the #fragment. Technically it's part of the
    //  fragment but react-router will treat it as the query
    // don't use window.location.search, use react-router's useLocation() instead
    // OBVIOUSLY don't use fragments at all as it stores the routing state
    const url = new URL(location.href);
    const oldSearch = url.search;
    url.search = '';

    if (!url.hash.startsWith('#/')) {
      url.hash = `#/${oldSearch}`;
    } else {
      url.hash += oldSearch;
    }

    // using history.replace instead of window.location to avoid relaunching the app
    globalThis.history.replaceState('', document.title, url.toString());
  }

  let rootElement = (
    <HelmetProvider>
      <CookiesProvider>
        <ReworkRootComponent>
          <BrowserRouter basename={basename}>
            {rootRoute}
          </BrowserRouter>
        </ReworkRootComponent>
      </CookiesProvider>
    </HelmetProvider>
  );

  // allow plugins to add components
  for (const clientHook of clientHooks) {
    if (clientHook.wrapRootComponent) {
      rootElement = clientHook.wrapRootComponent(rootElement);
    }
  }

  return rootElement;
};

export default RootComponent;